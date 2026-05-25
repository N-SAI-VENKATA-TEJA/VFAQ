# Project Context
This file serves as the living memory of the Vicharanashala FAQ Platform project. It is updated after every task completion, bug fix, or significant decision.

## Current Project State
- **Task 2: Authentication System** is **COMPLETED** (ready for verification).
- `User` Mongoose model created with password hashing (bcrypt).
- JWT utilities implemented for access/refresh tokens.
- Authentication controllers and routes built (register, login, me, refresh, logout).
- HTTP-only cookies utilized for token storage.
- Added `mongodb-memory-server` to automatically spin up a temporary database if `MONGODB_URI` is not present, allowing for immediate testing.

## Completed Tasks
- **Task 1:** Project Scaffolding
- **Task 2:** Authentication System (Backend)

## Next Task
- **Task 2 Verification**: User to verify endpoints via Postman using the provided `test-auth.http` file.
- **Task 3: Database Setup**: Prompt the user for the production/development `MONGODB_URI`.
