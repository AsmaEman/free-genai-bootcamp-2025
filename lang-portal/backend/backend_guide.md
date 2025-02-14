# Backend Development Guide (Node.js/Express/TypeScript)

## Initial Project Setup

```prompt
Create Node.js/Express project with TypeScript:

Project structure:
src/
├── config/
├── controllers/
├── services/
├── models/
├── middleware/
├── utils/
├── types/
└── tests/

Dependencies:
- express
- typescript
- pg
- typeorm
- jsonwebtoken
- bcrypt
- redis
- winston
- joi
- cors
- helmet

Configuration:
- TypeScript configuration
- ESLint + Prettier
- Jest setup
- PM2 configuration
- Docker setup
```

## Database Setup

```prompt
Configure PostgreSQL with TypeORM:

1. Connection setup:
- Connection pooling
- SSL configuration
- Migration system
- Entity loading

2. Base repository:
- Generic CRUD operations
- Transaction support
- Query builder
- Pagination handling

3. Migrations:
- Initial schema
- Seed data
- Index creation
- Constraint setup
```

## Core Services

### Authentication Service

```prompt
Implement authentication system:

1. AuthService:
- User registration
- Login with email/password
- JWT token generation
- Refresh token handling
- Password reset
- Email verification

2. Security features:
- Password hashing
- Token rotation
- Rate limiting
- Session management
- IP blocking

3. Middleware:
- Auth middleware
- Role middleware
- Permission middleware
```

### User Service

```prompt
Create user management service:

1. User model:
- Profile information
- Settings management
- Progress tracking
- Achievement system

2. User operations:
- CRUD operations
- Profile updates
- Settings management
- Progress tracking

3. Relations:
- Study sessions
- Word progress
- Achievements
- Learning paths
```

### Word Service

```prompt
Implement word management service:

1. Word model:
- Arabic text handling
- Diacritics management
- Audio references
- Usage examples
- Word relationships

2. Search functionality:
- Full-text search
- Diacritic-insensitive search
- Phonetic search
- Word group search

3. Word operations:
- CRUD operations
- Audio management
- Group management
- Progress tracking
```

### Study Service

```prompt
Create study session service:

1. Session management:
- Session creation
- Progress tracking
- Review scheduling
- Performance metrics

2. Spaced repetition:
- Algorithm implementation
- Review scheduling
- Mastery tracking
- Performance analysis

3. Progress tracking:
- Learning curves
- Error patterns
- Time analysis
- Achievement triggers
```

## API Endpoints

### Authentication Endpoints

```prompt
Implement authentication endpoints:

1. Auth routes:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
POST /api/auth/reset-password
POST /api/auth/verify-email

2. Validation:
- Input validation
- Token validation
- Rate limiting
- Error handling

3. Responses:
- Success responses
- Error responses
- Token handling
```

### Word Management Endpoints

```prompt
Create word management endpoints:

1. Word routes:
GET /api/words
GET /api/words/:id
POST /api/words/search
GET /api/words/:id/audio
POST /api/words/:id/progress

2. Features:
- Pagination
- Filtering
- Sorting
- Search options

3. Response handling:
- Data transformation
- Error handling
- Cache control
```

### Study Session Endpoints

```prompt
Implement study session endpoints:

1. Session routes:
POST /api/study/start
POST /api/study/submit
POST /api/study/end
GET /api/study/progress
GET /api/study/statistics

2. Session handling:
- State management
- Progress tracking
- Review submission
- Performance metrics

3. Data management:
- Cache strategy
- Progress updates
- Statistics calculation
```

## Testing Strategy

### Unit Tests

```prompt
Create unit test suite:

1. Service tests:
describe('AuthService', () => {
  it('should authenticate valid credentials')
  it('should handle invalid login attempts')
  it('should manage refresh tokens')
  it('should handle password reset')
})

2. Controller tests:
describe('WordController', () => {
  it('should handle Arabic text correctly')
  it('should manage search operations')
  it('should track word progress')
  it('should handle audio requests')
})

3. Middleware tests:
describe('AuthMiddleware', () => {
  it('should validate tokens')
  it('should handle expired tokens')
  it('should check permissions')
  it('should rate limit requests')
})
```

### Integration Tests

```prompt
Implement integration test suite:

1. API tests:
describe('Word API', () => {
  it('should perform CRUD operations')
  it('should handle search queries')
  it('should manage relationships')
  it('should track progress')
})

2. Database tests:
describe('Database Operations', () => {
  it('should handle transactions')
  it('should maintain constraints')
  it('should manage indexes')
  it('should handle concurrency')
})

3. Cache tests:
describe('Cache Operations', () => {
  it('should cache responses')
  it('should invalidate cache')
  it('should handle race conditions')
  it('should manage memory')
})
```

## Performance Testing

```prompt
Create performance test suite:

1. Load testing:
- Endpoint performance
- Concurrent users
- Database load
- Cache effectiveness

2. Stress testing:
- System limits
- Error handling
- Recovery testing
- Resource usage

3. Benchmarking:
- Response times
- Query performance
- Memory usage
- CPU utilization
```

## Monitoring Setup

```prompt
Implement monitoring system:

1. Health checks:
- Database connection
- Redis connection
- External services
- System resources

2. Metrics:
- Response times
- Error rates
- Cache hit rates
- Queue lengths

3. Logging:
- Error logging
- Access logging
- Performance logging
- Audit logging
```

## Deployment Configuration

```prompt
Setup deployment configuration:

1. Docker setup:
- Multi-stage build
- Production optimization
- Environment handling
- Volume management

2. Database deployment:
- Migration strategy
- Backup system
- Scaling setup
- Monitoring tools

3. CI/CD pipeline:
- Build process
- Test execution
- Deployment steps
- Rollback procedure
```
