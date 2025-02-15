# Arabic Language Learning Platform - Technical Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technical Stack](#technical-stack)
3. [Project Structure](#project-structure)
4. [Setup & Installation](#setup--installation)
5. [API Documentation](#api-documentation)
6. [Database Models](#database-models)
7. [Authentication](#authentication)
8. [Testing](#testing)
9. [Error Handling](#error-handling)
10. [Deployment](#deployment)

## Project Overview

A comprehensive Arabic language learning platform backend that provides APIs for word management, study sessions, and user progress tracking. The platform enables users to learn Arabic vocabulary, track their study progress, and manage learning sessions.

## Technical Stack

- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (JSON Web Tokens)
- **Testing**: Jest & Supertest
- **API Documentation**: Swagger/OpenAPI
- **Logging**: Winston
- **Security**: Helmet, CORS
- **Validation**: Joi
- **Development**: Nodemon, ts-node

## Project Structure

```
src/
├── config/
│   ├── database.ts     # Database configuration with TypeORM
│   ├── swagger.ts      # Swagger documentation setup
│   └── index.ts        # Environment configuration
├── controllers/
│   ├── auth.controller.ts      # Authentication logic
│   ├── word.controller.ts      # Word management
│   └── study-session.controller.ts
├── middleware/
│   ├── auth.middleware.ts      # JWT authentication
│   ├── error.middleware.ts     # Global error handling
│   └── validation.middleware.ts
├── models/
│   ├── User.ts                 # User model with TypeORM
│   ├── Word.ts                 # Word model
│   └── StudySession.ts         # Study session model
├── routes/
│   ├── auth.routes.ts
│   ├── word.routes.ts
│   └── study-session.routes.ts
├── services/
│   ├── auth.service.ts
│   ├── word.service.ts
│   └── study-session.service.ts
├── tests/
│   └── api/
│       ├── auth.api.test.ts
│       ├── word.api.test.ts
│       └── study-session.api.test.ts
├── utils/
│   ├── appError.ts
│   └── logger.ts
├── validations/
│   ├── auth.validation.ts
│   ├── word.validation.ts
│   └── study-session.validation.ts
├── app.ts              # Express app setup
└── index.ts           # Application entry point
```

## Setup & Installation

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- npm or yarn

### Installation Steps

```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

### Environment Variables

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
```

### Available Scripts

```json
{
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "test": "jest --detectOpenHandles",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:api": "jest --testPathPattern=src/tests/api --detectOpenHandles --forceExit",
    "lint": "eslint . --ext .ts",
    "format": "prettier --write \"src/**/*.ts\"",
    "typeorm": "typeorm-ts-node-commonjs -d ./src/config/database.ts",
    "migration:generate": "npm run typeorm migration:generate",
    "migration:run": "npm run typeorm migration:run",
    "migration:revert": "npm run typeorm migration:revert"
  }
}
```

## API Documentation

### Authentication Endpoints

#### POST /api/auth/register

Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name"
    },
    "token": "jwt-token"
  }
}
```

#### POST /api/auth/login

Login existing user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "token": "jwt-token",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "User Name"
    }
  }
}
```

### Word Management Endpoints

#### POST /api/words

Create a new word (Protected Route).

**Request:**
```json
{
  "arabicText": "مرحبا",
  "englishTranslation": "hello",
  "diacritics": "مَرْحَبًا",
  "examples": ["مرحبا بك", "مرحبا وسهلا"],
  "tags": ["greeting", "basic"]
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "arabicText": "مرحبا",
    "englishTranslation": "hello",
    "diacritics": "مَرْحَبًا",
    "examples": ["مرحبا بك", "مرحبا وسهلا"],
    "tags": ["greeting", "basic"],
    "metadata": {},
    "relatedWords": [],
    "createdAt": "2024-03-10T12:00:00Z",
    "updatedAt": "2024-03-10T12:00:00Z"
  }
}
```

#### GET /api/words/search

Search words.

**Query Parameters:**
- `query`: Search term (required)
- `page`: Page number (default: 1)
- `limit`: Results per page (default: 10)

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "words": [
      {
        "id": "uuid",
        "arabicText": "مرحبا",
        "englishTranslation": "hello",
        "diacritics": "مَرْحَبًا",
        "examples": ["مرحبا بك"],
        "tags": ["greeting"],
        "metadata": {},
        "relatedWords": []
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 10,
      "pages": 1
    }
  }
}
```

### Study Session Endpoints

#### POST /api/study-sessions

Create a new study session (Protected Route).

**Request:**
```json
{
  "sessionData": {
    "duration": 1800,
    "wordsStudied": ["word-id-1", "word-id-2"],
    "correctAnswers": 8,
    "incorrectAnswers": 2
  }
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "id": "uuid",
    "userId": "user-id",
    "sessionData": {
      "duration": 1800,
      "wordsStudied": ["word-id-1", "word-id-2"],
      "correctAnswers": 8,
      "incorrectAnswers": 2
    },
    "status": "completed",
    "createdAt": "2024-03-10T12:00:00Z",
    "updatedAt": "2024-03-10T12:00:00Z"
  }
}
```

## Database Models

### User Model

```typescript
interface User {
  id: string;           // UUID primary key
  email: string;        // Unique email address
  password: string;     // Hashed password
  name: string;         // User's full name
  createdAt: Date;      // Timestamp of creation
  updatedAt: Date;      // Timestamp of last update
  studySessions: StudySession[];  // Relation to study sessions
}
```

### Word Model

```typescript
interface Word {
  id: string;           // UUID primary key
  arabicText: string;   // Arabic word
  englishTranslation: string;  // English translation
  diacritics?: string; // Optional Arabic diacritics
  examples: string[];   // Usage examples
  tags: string[];      // Categorization tags
  metadata: {          // Additional metadata
    difficulty?: string;  // beginner, intermediate, advanced
    category?: string;   // noun, verb, etc.
    usage?: string[];    // Context information
  };
  relatedWords: string[];  // IDs of related words
  createdAt: Date;     // Timestamp of creation
  updatedAt: Date;     // Timestamp of last update
}
```

### StudySession Model

```typescript
interface StudySession {
  id: string;          // UUID primary key
  userId: string;      // Reference to User
  sessionData: {
    duration: number;  // Session duration in seconds
    wordsStudied: string[];  // Array of word IDs
    correctAnswers: number;  // Number of correct responses
    incorrectAnswers: number;  // Number of incorrect responses
  };
  status: 'in_progress' | 'completed' | 'interrupted';  // Session status
  createdAt: Date;     // Timestamp of creation
  updatedAt: Date;     // Timestamp of last update
  user: User;          // Relation to user
}
```

### Prisma Schema

```prisma
model User {
  id            String         @id @default(uuid())
  email         String         @unique
  password      String
  name          String
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
  studySessions StudySession[]
}

model Word {
  id                String   @id @default(uuid())
  arabicText        String
  englishTranslation String
  diacritics        String?
  examples          String[]
  tags              String[]
  metadata          Json
  relatedWords      String[]
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

model StudySession {
  id          String   @id @default(uuid())
  userId      String
  sessionData Json
  status      String
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  user        User     @relation(fields: [userId], references: [id])
}
```

## Testing

### Test Structure

```
tests/
└── api/
    ├── auth.api.test.ts     # Authentication tests
    ├── word.api.test.ts     # Word management tests
    └── study-session.api.test.ts  # Study session tests
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:words
npm run test:study
npm run test:auth

# Run tests with coverage
npm run test:coverage

# Run API tests only
npm run test:api
```

### Test Setup

```typescript
import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { PrismaClient } from '@prisma/client';

// Mock database connection
jest.mock('../config/database', () => ({
  AppDataSource: {
    initialize: jest.fn().mockResolvedValue(true),
    getRepository: jest.fn(),
  },
}));

// Mock environment variables
process.env.JWT_SECRET = 'test-secret';

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(async () => {
  const prisma = new PrismaClient();
  await prisma.$disconnect();
  jest.clearAllMocks();
});
```

## Error Handling

### Global Error Handler

```typescript
interface AppError {
  status: string;
  statusCode: number;
  message: string;
  isOperational: boolean;
}

const errorMiddleware = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
```

### Error Response Format

```json
{
  "status": "error",
  "message": "Error description",
  "code": "ERROR_CODE"  // Optional error code
}
```

### HTTP Status Codes

- 200: Success
- 201: Created
- 400: Bad Request (Invalid input)
- 401: Unauthorized (Authentication required)
- 403: Forbidden (Insufficient permissions)
- 404: Not Found
- 422: Unprocessable Entity (Validation failed)
- 500: Internal Server Error

### Custom Error Classes

```typescript
// Base Error Class
class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public isOperational = true
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

// Validation Error
class ValidationError extends AppError {
  constructor(message: string) {
    super(400, message);
  }
}

// Authentication Error
class AuthenticationError extends AppError {
  constructor(message: string) {
    super(401, message);
  }
}

// Authorization Error
class AuthorizationError extends AppError {
  constructor(message: string) {
    super(403, message);
  }
}
```