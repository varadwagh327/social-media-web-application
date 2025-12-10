# Social Media Backend API

Professional REST API for a social media platform built with **Node.js**, **Express**, and **MongoDB**, following **MVC architecture** and industry best practices.

## 🌟 Features

### Core Features
- ✅ **User Authentication & Authorization**
  - Secure signup & login with JWT tokens
  - Access token + Refresh token implementation
  - Password reset & recovery
  - Email verification support

- ✅ **Post Management**
  - Create, read, update, delete posts
  - Support for text, image, and video content
  - Post visibility controls (public, private, friends)
  - Likes, comments, and sharing functionality

- ✅ **User Interactions**
  - Follow/unfollow system with counters
  - User profiles with bio and cover images
  - Search functionality for users and posts
  - Suggested users recommendations

- ✅ **Direct Messaging**
  - Real-time messaging between users
  - Message read receipts
  - Conversation threading
  - Message reactions support

### Technical Features
- 🔒 **Security**
  - Role-based access control (user, admin, moderator)
  - Rate limiting on sensitive endpoints
  - Data sanitization & validation (Joi)
  - CORS configuration
  - Helmet.js security headers
  - JWT-based authentication

- 📈 **Scalability**
  - Database indexing for fast queries
  - Pagination support
  - Efficient query optimization
  - Async/await patterns
  - Background task support (via Redis - optional)

- 📝 **Code Quality**
  - Clean MVC architecture
  - Comprehensive error handling
  - Unit & integration tests with Jest
  - API documentation with Swagger/OpenAPI
  - Logging & monitoring

- 🚀 **Performance**
  - Request compression
  - Response caching ready
  - File upload optimization
  - Connection pooling

## 📦 Project Structure

```
Backend/
├── config/
│   ├── config.env          # Environment variables
│   └── index.js            # Configuration loader
├── controller/
│   ├── authController.js   # Authentication handlers
│   ├── postController.js   # Post management handlers
│   └── userController.js   # User management handlers
├── database/
│   └── dbConnection.js     # MongoDB connection
├── middlewares/
│   ├── auth.js             # Authentication middleware
│   ├── catchAsyncErrors.js # Async error handling
│   ├── errorMiddleware.js  # Global error handler
│   ├── rateLimiter.js      # Rate limiting
│   └── validation.js       # Request validation
├── models/
│   ├── userSchema.js       # User schema
│   ├── postSchema.js       # Post schema
│   ├── commentSchema.js    # Comment schema
│   └── messageSchema.js    # Message schema
├── router/
│   ├── authRouter.js       # Auth routes
│   ├── postRouter.js       # Post routes
│   ├── userRouter.js       # User routes
│   └── messageRouter.js    # Messaging routes
├── schemas/
│   ├── authSchema.js       # Auth validation
│   ├── postSchema.js       # Post validation
│   └── userSchema.js       # User validation
├── services/
│   ├── authService.js      # Auth business logic
│   ├── postService.js      # Post business logic
│   └── userService.js      # User business logic
├── utils/
│   ├── fileHelper.js       # File utilities
│   ├── jwtToken.js         # JWT utilities
│   └── emailService.js     # Email utilities
├── tests/
│   ├── unit/               # Unit tests
│   └── integration/        # Integration tests
├── app.js                  # Express app setup
├── server.js               # Server entry point
├── package.json            # Dependencies
└── README.md               # Documentation
```

## 🚀 Getting Started

### Prerequisites
- Node.js v16+ 
- MongoDB v4.4+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
cd Backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp config/config.env.example config/config.env
# Edit config/config.env with your settings
```

4. **Start the server**
```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

The server will start on the configured port (default: 5000)

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/v1
```

### Authentication Endpoints

#### Register User
```http
POST /auth/signup
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer {access_token}
```

#### Logout
```http
POST /auth/logout
Authorization: Bearer {access_token}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "{refresh_token}"
}
```

### Post Endpoints

#### Create Post
```http
POST /posts
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "My First Post",
  "description": "This is my first post",
  "content": "Long form content here...",
  "contentType": "text",
  "tags": ["life", "journey"],
  "visibility": "public"
}
```

#### Get All Posts
```http
GET /posts?page=1&limit=20
Authorization: Bearer {access_token}
```

#### Get Post by ID
```http
GET /posts/:postId
```

#### Update Post
```http
PUT /posts/:postId
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}
```

#### Delete Post
```http
DELETE /posts/:postId
Authorization: Bearer {access_token}
```

#### Like Post
```http
POST /posts/:postId/like
Authorization: Bearer {access_token}
```

#### Add Comment
```http
POST /posts/:postId/comments
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "content": "Great post!"
}
```

### User Endpoints

#### Get User Profile
```http
GET /users/:userId
```

#### Get Current User Profile
```http
GET /users/profile/me
Authorization: Bearer {access_token}
```

#### Update Profile
```http
PUT /users/profile/me
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "fullName": "John Updated",
  "bio": "Software developer",
  "profilePicture": "url_to_image"
}
```

#### Follow User
```http
POST /users/:userId/follow
Authorization: Bearer {access_token}
```

#### Search Users
```http
GET /users/search?q=john&page=1&limit=20
```

#### Get Suggested Users
```http
GET /users/suggestions?limit=10
Authorization: Bearer {access_token}
```

### Messaging Endpoints

#### Send Message
```http
POST /messages/send
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "recipientId": "recipient_user_id",
  "content": "Hello, how are you?"
}
```

#### Get Conversation
```http
GET /messages/conversation/:userId?page=1&limit=50
Authorization: Bearer {access_token}
```

#### Get All Conversations
```http
GET /messages/conversations
Authorization: Bearer {access_token}
```

## 🔐 Security Features

### Authentication
- JWT tokens with expiration
- Secure password hashing with bcryptjs
- Token refresh mechanism
- Email verification

### Authorization
- Role-based access control
- Protected routes
- Admin-only endpoints

### Data Protection
- Input validation with Joi
- SQL injection prevention
- XSS protection with helmet
- CORS configuration
- Rate limiting

### Password Security
- Minimum 8 characters
- Must contain uppercase, lowercase, number, and special character
- Bcryptjs hashing with salt rounds

## 🧪 Testing

### Run Unit Tests
```bash
npm test
```

### Run with Coverage
```bash
npm run test:coverage
```

### Watch Mode
```bash
npm run test:watch
```

## 📋 Pagination

All list endpoints support pagination:

**Query Parameters:**
- `page` (default: 1) - Page number
- `limit` (default: 20, max: 100) - Items per page
- `sort` (default: -createdAt) - Sort order

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

## 🔄 Rate Limiting

Rate limits are applied to protect the API:

- **General API**: 100 requests per 15 minutes
- **Authentication**: 10 attempts per 15 minutes  
- **Admin**: 200 requests per 15 minutes
- **File Upload**: 50 uploads per hour

## 🗄️ Database Models

### User Model
```javascript
{
  username: String,
  email: String,
  password: String (hashed),
  fullName: String,
  bio: String,
  profilePicture: String,
  role: String (user, admin, moderator),
  followers: [ObjectId],
  following: [ObjectId],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Post Model
```javascript
{
  author: ObjectId,
  title: String,
  description: String,
  content: String,
  media: [{ url, type, thumbnail }],
  likes: [ObjectId],
  comments: [ObjectId],
  tags: [String],
  visibility: String,
  slug: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Model
```javascript
{
  post: ObjectId,
  author: ObjectId,
  content: String,
  likes: [ObjectId],
  replies: [ObjectId],
  isDeleted: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Message Model
```javascript
{
  sender: ObjectId,
  recipient: ObjectId,
  content: String,
  media: [{ url, type }],
  isRead: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🌐 Environment Variables

Create a `.env` file in `/config` directory:

```env
# App Config
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/social-media

# JWT
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_ENABLED=true
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_UPLOAD_SIZE=52428800
UPLOAD_DIR=./uploads

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Redis (Optional)
REDIS_ENABLED=false
REDIS_URL=redis://localhost:6379

# AWS S3 (Optional)
S3_ENABLED=false
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_BUCKET_NAME=
```

## 📊 API Response Format

All API responses follow a consistent format:

### Success Response
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Operation successful",
  "data": {
    ...
  },
  "pagination": {} // If applicable
}
```

### Error Response
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description"
}
```

## 🛠️ Development Tools

- **Express.js** - Web framework
- **Mongoose** - MongoDB ORM
- **Joi** - Data validation
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Morgan** - HTTP logging
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Jest** - Testing framework
- **Nodemailer** - Email service

## 📈 Performance Tips

1. **Database Indexing** - Queries use indexes for faster retrieval
2. **Pagination** - Always paginate large datasets
3. **Caching** - Implement Redis for frequently accessed data
4. **Compression** - Response compression enabled by default
5. **Rate Limiting** - Protects against abuse

## 🐛 Error Handling

All errors are caught and formatted consistently:

```javascript
{
  "success": false,
  "statusCode": 400,
  "message": "Validation error message"
}
```

Common status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `413` - Payload Too Large
- `500` - Internal Server Error

## 🚀 Deployment

### Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Use secure JWT secrets
- [ ] Configure MongoDB with authentication
- [ ] Enable HTTPS
- [ ] Set up proper CORS origins
- [ ] Configure email service
- [ ] Enable rate limiting
- [ ] Setup logging
- [ ] Run tests before deployment
- [ ] Setup monitoring & alerts

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For issues and questions:
- Open an issue on GitHub
- Contact: support@example.com

---

**Built with ❤️ using Node.js and MongoDB**
