import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { createRetrievalChain } from 'langchain/chains/retrieval';
import { createStuffDocumentsChain } from 'langchain/chains/combine_documents';
import { PromptTemplate } from '@langchain/core/prompts';
import { FAQ } from '../models/FAQ';
import { Document } from '@langchain/core/documents';

export let vectorStore: MemoryVectorStore | null = null;
let embeddings: GoogleGenerativeAIEmbeddings | null = null;
let llm: ChatGoogleGenerativeAI | null = null;

export const initRAG = async () => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is not set. RAG pipeline will not be initialized.');
    return;
  }

  try {
    embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-embedding-2'
    });

    llm = new ChatGoogleGenerativeAI({
      apiKey: process.env.GEMINI_API_KEY,
      model: 'gemini-flash-latest',
      temperature: 0,
    });

    // Fetch all published FAQs
    const faqs = await FAQ.find({ isDeleted: false, isPublished: true });
    
    const docs = [];
    const vectors = [];

    for (const faq of faqs) {
      if (faq.embedding && faq.embedding.length > 0) {
        docs.push(new Document({
          pageContent: `Section: ${faq.section}\nQuestion: ${faq.question}\nAnswer: ${faq.answer}`,
          metadata: { section: faq.section, id: faq._id.toString() }
        }));
        vectors.push(faq.embedding);
      }
    }

    vectorStore = new MemoryVectorStore(embeddings);
    
    if (docs.length > 0) {
      await vectorStore.addVectors(vectors, docs);
    }
    
    console.log(`Initialized RAG vector store with ${docs.length} FAQs from DB.`);
  } catch (error) {
    console.error('Failed to initialize RAG pipeline:', error);
  }
};

export const addDocumentToRAG = async (faq: any) => {
  if (!vectorStore) return;

  try {
    let embedding = faq.embedding;
    
    // If embedding is missing or empty, generate it!
    if (!embedding || embedding.length === 0) {
      if (!embeddings) {
        embeddings = new GoogleGenerativeAIEmbeddings({
          apiKey: process.env.GEMINI_API_KEY,
          model: 'gemini-embedding-2'
        });
      }
      const text = `Section: ${faq.section}\nQuestion: ${faq.question}\nAnswer: ${faq.answer}`;
      embedding = await embeddings.embedQuery(text);
      faq.embedding = embedding;
      await faq.save();
    }

    if (embedding && embedding.length > 0) {
      const doc = new Document({
        pageContent: `Section: ${faq.section}\nQuestion: ${faq.question}\nAnswer: ${faq.answer}`,
        metadata: { section: faq.section, id: faq._id.toString() }
      });
      await vectorStore.addVectors([embedding], [doc]);
      console.log(`Added FAQ ${faq._id} to RAG vector store.`);
    }
  } catch (e) {
    console.error('Failed to add FAQ to RAG:', e);
  }
};

export const generateAnswer = async (question: string) => {
  if (!llm) {
    throw new Error('RAG pipeline is not initialized or GEMINI_API_KEY is missing.');
  }

  // Create a prompt template specifically for FAQs
  const prompt = PromptTemplate.fromTemplate(`
    You are an AI assistant for the Vicharanashala Internship program at IIT Ropar.
    Your goal is to accurately answer user questions based strictly on the provided FAQ context.
    If the context does not contain the answer, politely state that you do not know and suggest they submit a new query to the admin team. Do not make up answers.

    Context:
    {context}

    Question: {input}
    Answer:
  `);

  const combineDocsChain = await createStuffDocumentsChain({
    llm: llm as any,
    prompt: prompt as any,
  });

  try {
    if (vectorStore && vectorStore.memoryVectors.length > 0) {
      // Create a retriever
      const retriever = vectorStore.asRetriever({ k: 4 }); // Retrieve top 4 most relevant FAQs

      const retrievalChain = await createRetrievalChain({
        retriever: retriever as any,
        combineDocsChain: combineDocsChain as any,
      });

      const response = await retrievalChain.invoke({
        input: question,
      });

      return response.answer;
    }
  } catch (error: any) {
    console.warn('Vector store retrieval failed (likely rate limit), falling back to text search:', error.message);
  }

  // Fallback: MongoDB Regex Search
  console.log('Using MongoDB fallback search for question:', question);
  // Extract keywords from the question (words longer than 3 characters)
  const keywords = question.split(/\\s+/).filter(w => w.length > 3).map(w => w.replace(/[^a-zA-Z0-9]/g, ''));
  
  let fallbackDocs: Document[] = [];
  if (keywords.length > 0) {
    const regexPattern = keywords.join('|');
    const faqs = await FAQ.find({
      isDeleted: false,
      isPublished: true,
      $or: [
        { question: new RegExp(regexPattern, 'i') },
        { answer: new RegExp(regexPattern, 'i') },
        { section: new RegExp(regexPattern, 'i') }
      ]
    }).limit(5);

    fallbackDocs = faqs.map(faq => new Document({
      pageContent: `Section: ${faq.section}\nQuestion: ${faq.question}\nAnswer: ${faq.answer}`,
      metadata: { section: faq.section, id: faq._id.toString() }
    }));
  }

  // If no docs found, try to just fetch the latest FAQs to provide some context, or empty
  if (fallbackDocs.length === 0) {
    const faqs = await FAQ.find({ isDeleted: false, isPublished: true }).limit(3);
    fallbackDocs = faqs.map(faq => new Document({
      pageContent: `Section: ${faq.section}\nQuestion: ${faq.question}\nAnswer: ${faq.answer}`,
      metadata: { section: faq.section, id: faq._id.toString() }
    }));
  }

  const response = await combineDocsChain.invoke({
    input: question,
    context: fallbackDocs,
  });

  return response;
};
