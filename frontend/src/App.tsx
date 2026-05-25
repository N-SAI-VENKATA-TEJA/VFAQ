import { useState } from 'react'

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="glass-card max-w-md w-full p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Vicharanashala FAQ</h1>
          <p className="text-slate-600">Testing our glassmorphism design tokens</p>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 glass rounded-xl">
            <h3 className="font-semibold text-slate-800">What is glassmorphism?</h3>
            <p className="text-sm text-slate-600 mt-1">
              A UI design style that uses transparency and background blur to create a frosted glass effect.
            </p>
          </div>
          
          <input 
            type="text" 
            placeholder="Search FAQs..." 
            className="w-full p-3 glass-input text-slate-800"
          />
          
          <button className="w-full p-3 glass-button font-medium text-slate-800">
            Submit a Question
          </button>
        </div>
        
        <div className="flex justify-center mt-6">
          <span className="glass-badge px-3 py-1 text-xs font-medium text-slate-600">
            Design Verification
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
