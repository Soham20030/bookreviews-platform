# BookReviews Platform

A comprehensive full-stack web application for book enthusiasts to discover, review, and track their reading journey. Built with modern technologies and designed for scalability, BookReviews provides a complete social reading experience with user authentication, book management, review systems, and social networking features.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Authentication Flow](#authentication-flow)
- [Contributing](#contributing)
- [Testing](#testing)
- [Deployment](#deployment)
- [License](#license)

## Overview

BookReviews is a modern web platform that combines the functionality of a digital library with social networking features. Users can discover new books, write comprehensive reviews, track their reading progress, and connect with fellow book enthusiasts. The platform provides a seamless experience across desktop and mobile devices with responsive design and intuitive user interfaces.

### Key Objectives

- Create a centralized platform for book discovery and reviews
- Enable users to track their reading progress and maintain personal libraries
- Foster a community of readers through social features
- Provide comprehensive search and filtering capabilities
- Ensure data security and user privacy through robust authentication

## Features

### Core Functionality

**User Authentication & Authorization**
- Secure JWT-based authentication system
- User registration with email verification
- Password encryption using industry-standard hashing
- Protected routes and middleware validation
- Session management and automatic logout

**Book Management**
- Comprehensive book database with detailed information
- Advanced search functionality with multiple filters
- Book creation and editing capabilities
- Genre categorization and tagging
- Average rating calculations and review statistics

**Review System**
- Detailed book reviews with star ratings (1-5 scale)
- Rich text review composition with character limits
- Review editing and deletion for authors
- Review sorting by date, rating, and popularity
- Review validation and moderation capabilities

**Social Features**
- User profiles with customizable information
- Follow/unfollow system for connecting with other readers
- Activity feeds showing recent reviews and updates
- User search and discovery functionality
- Social statistics (followers, following, review counts)

**Reading Progress Tracking**
- Personal library management system
- Reading status categories: Currently Reading, Finished, Want to Read, Did Not Finish
- Reading date tracking and statistics
- Progress visualization and reading goals
- Library organization and filtering options

**Interactive Elements**
- Comment system for reviews with threaded discussions
- Like/unlike functionality for reviews
- Real-time updates and notifications
- Responsive user interfaces with loading states
- Form validation and error handling

### Advanced Features

**Search & Discovery**
- Multi-parameter search (title, author, genre, rating)
- Advanced filtering with sorting options
- User recommendation algorithms
- Trending books and popular reviews
- Related book suggestions

**User Experience**
- Responsive design optimized for all screen sizes
- Intuitive navigation with breadcrumb trails
- Loading states and skeleton screens
- Error boundaries and graceful error handling
- Accessibility compliance with ARIA labels

**Performance Optimizations**
- Lazy loading for improved page speeds
- Database query optimization with indexing
- Caching strategies for frequently accessed data
- Image optimization and compression
- API response compression

## Technology Stack

### Backend Technologies

**Runtime & Framework**
- **Node.js**: JavaScript runtime for server-side execution
- **Express.js**: Fast, unopinionated web framework for API development
- **PostgreSQL**: Robust relational database for data persistence

**Authentication & Security**
- **JSON Web Tokens (JWT)**: Stateless authentication mechanism
- **bcrypt**: Password hashing and salting for security
- **helmet**: Security middleware for HTTP headers
- **cors**: Cross-Origin Resource Sharing configuration

**Development Tools**
- **nodemon**: Automatic server restart during development
- **morgan**: HTTP request logging middleware
- **express-rate-limit**: API rate limiting and DDoS protection

### Frontend Technologies

**Core Framework**
- **React 18**: Modern JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing and navigation

**State Management**
- **React Context API**: Global state management for authentication
- **React Hooks**: Component state and lifecycle management
- **Custom hooks**: Reusable stateful logic

**Styling & UI**
- **CSS3**: Modern styling with CSS variables and flexbox/grid
- **Responsive Design**: Mobile-first approach with media queries
- **Custom Components**: Reusable UI components with consistent styling

**Development & Build**
- **ESLint**: Code linting and style consistency
- **Prettier**: Automatic code formatting
- **Hot Module Replacement**: Real-time development updates

### Database Design

**Relational Structure**
- **Users**: User account information and preferences
- **Books**: Book metadata and catalog information
- **Reviews**: User reviews with ratings and timestamps
- **Comments**: Review comments and discussion threads
- **Follows**: User relationship mapping
- **Reading Status**: User reading progress tracking
- **Likes**: Review like/unlike tracking

## Installation

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js** (version 16.x or higher)
- **npm** (version 8.x or higher) or **yarn**
- **PostgreSQL** (version 12.x or higher)
- **Git** for version control

### Clone Repository


### Backend Setup

git clone https://github.com/Somsid@2014/bookreviews-platform.git
cd bookreviews-platform

1. Navigate to the backend directory:

cd backend


2. Install backend dependencies:


3. Create environment configuration file:


4. Configure your environment variables in `.env`:

Database Configuration

DB_HOST=localhost
DB_PORT=5432
DB_NAME=bookreviews_db
DB_USER=your_db_username
DB_PASSWORD=your_db_password
JWT Configuration

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
Server Configuration

PORT=5000
NODE_ENV=development
CORS Configuration

FRONTEND_URL=http://localhost:3001


5. Set up PostgreSQL database:


Create database

createdb bookreviews_db


6. Start the backend server:


### Frontend Setup

1. Navigate to the frontend directory:

cd frontend


2. Install frontend dependencies:

npm install


3. Create environment configuration:

cp .env.example .env.local

4. Configure frontend environment variables:



VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=BookReviews


5. Start the development server:

npm run dev



### Access the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Environment Setup

### Development Environment

The development environment includes hot reloading, detailed error messages, and development-specific middleware configurations. Debug mode is enabled for comprehensive logging.

### Production Environment

Production setup includes optimized builds, compressed assets, security headers, and performance monitoring. Environment variables should be configured securely with production database credentials.

### Testing Environment

Separate testing database and configurations for running automated tests without affecting development data.

## Database Schema

### Core Tables

**users**
- `id` (Primary Key): Unique user identifier
- `username` (Unique): User's chosen username
- `email` (Unique): User's email address
- `password_hash`: Encrypted password
- `display_name`: User's display name
- `bio`: User biography/description
- `avatar_url`: Profile picture URL
- `created_at`: Account creation timestamp
- `updated_at`: Last profile update timestamp

**books**
- `id` (Primary Key): Unique book identifier
- `title`: Book title
- `author`: Book author(s)
- `genre`: Book genre/category
- `description`: Book description/summary
- `created_by` (Foreign Key): User who added the book
- `created_at`: Book addition timestamp
- `updated_at`: Last book update timestamp

**reviews**
- `id` (Primary Key): Unique review identifier
- `user_id` (Foreign Key): Reviewer's user ID
- `book_id` (Foreign Key): Reviewed book ID
- `rating`: Numeric rating (1-5)
- `review_text`: Review content
- `created_at`: Review creation timestamp
- `updated_at`: Last review update timestamp

**comments**
- `id` (Primary Key): Unique comment identifier
- `review_id` (Foreign Key): Associated review ID
- `user_id` (Foreign Key): Commenter's user ID
- `comment_text`: Comment content
- `created_at`: Comment creation timestamp
- `updated_at`: Last comment update timestamp

**follows**
- `id` (Primary Key): Unique relationship identifier
- `follower_id` (Foreign Key): Following user ID
- `following_id` (Foreign Key): Followed user ID
- `created_at`: Follow relationship timestamp

**reading_statuses**
- `id` (Primary Key): Unique status identifier
- `user_id` (Foreign Key): User's ID
- `book_id` (Foreign Key): Book ID
- `status`: Reading status (enum: currently_reading, finished, want_to_read, did_not_finish)
- `started_date`: Reading start date
- `finished_date`: Reading completion date
- `created_at`: Status creation timestamp
- `updated_at`: Last status update timestamp

**review_likes**
- `id` (Primary Key): Unique like identifier
- `review_id` (Foreign Key): Liked review ID
- `user_id` (Foreign Key): User who liked the review
- `created_at`: Like timestamp

## API Documentation

### Authentication Endpoints

**POST** `/api/auth/register`
- **Description**: Register a new user account
- **Request Body**: `{ username, email, password, display_name }`
- **Response**: `{ message, user, token }`
- **Status Codes**: 201 (Created), 400 (Validation Error), 409 (Conflict)

**POST** `/api/auth/login`
- **Description**: Authenticate user and receive JWT token
- **Request Body**: `{ email, password }`
- **Response**: `{ message, user, token }`
- **Status Codes**: 200 (Success), 401 (Unauthorized), 400 (Bad Request)

**GET** `/api/auth/profile`
- **Description**: Get current user profile (requires authentication)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ user }`
- **Status Codes**: 200 (Success), 401 (Unauthorized)

### Book Management Endpoints

**GET** `/api/books`
- **Description**: Retrieve books with optional filtering and pagination
- **Query Parameters**: `search`, `genre`, `minRating`, `maxRating`, `sortBy`, `limit`, `offset`
- **Response**: `{ books, total, genres }`
- **Status Codes**: 200 (Success), 500 (Server Error)

**POST** `/api/books`
- **Description**: Create a new book entry (requires authentication)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{ title, author, genre, description }`
- **Response**: `{ message, book }`
- **Status Codes**: 201 (Created), 400 (Validation Error), 401 (Unauthorized)

**GET** `/api/books/:id`
- **Description**: Get detailed book information including reviews
- **Parameters**: `id` (book ID)
- **Response**: `{ book, reviews }`
- **Status Codes**: 200 (Success), 404 (Not Found), 500 (Server Error)

### Review System Endpoints

**POST** `/api/books/:id/reviews`
- **Description**: Create a review for a specific book (requires authentication)
- **Headers**: `Authorization: Bearer <token>`
- **Parameters**: `id` (book ID)
- **Request Body**: `{ rating, review_text }`
- **Response**: `{ message, review }`
- **Status Codes**: 201 (Created), 400 (Validation Error), 401 (Unauthorized)

**PUT** `/api/books/:id/reviews/:reviewId`
- **Description**: Update an existing review (requires ownership)
- **Headers**: `Authorization: Bearer <token>`
- **Parameters**: `id` (book ID), `reviewId` (review ID)
- **Request Body**: `{ rating, review_text }`
- **Response**: `{ message, review }`
- **Status Codes**: 200 (Success), 403 (Forbidden), 404 (Not Found)

**DELETE** `/api/books/:id/reviews/:reviewId`
- **Description**: Delete a review (requires ownership)
- **Headers**: `Authorization: Bearer <token>`
- **Parameters**: `id` (book ID), `reviewId` (review ID)
- **Response**: `{ message }`
- **Status Codes**: 200 (Success), 403 (Forbidden), 404 (Not Found)

### Social Features Endpoints

**POST** `/api/follows/:userId`
- **Description**: Follow a user (requires authentication)
- **Headers**: `Authorization: Bearer <token>`
- **Parameters**: `userId` (user to follow)
- **Response**: `{ message }`
- **Status Codes**: 200 (Success), 400 (Bad Request), 401 (Unauthorized)

**DELETE** `/api/follows/:userId`
- **Description**: Unfollow a user (requires authentication)
- **Headers**: `Authorization: Bearer <token>`
- **Parameters**: `userId` (user to unfollow)
- **Response**: `{ message }`
- **Status Codes**: 200 (Success), 401 (Unauthorized)

**GET** `/api/users/:id/profile`
- **Description**: Get user profile information
- **Parameters**: `id` (user ID)
- **Response**: `{ user, recentReviews }`
- **Status Codes**: 200 (Success), 404 (Not Found)

### Reading Status Endpoints

**POST** `/api/reading-status`
- **Description**: Set reading status for a book (requires authentication)
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{ bookId, status, startedDate?, finishedDate? }`
- **Response**: `{ message, readingStatus }`
- **Status Codes**: 201 (Created), 400 (Validation Error), 401 (Unauthorized)

**GET** `/api/reading-status`
- **Description**: Get all reading statuses for current user (requires authentication)
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `{ library }`
- **Status Codes**: 200 (Success), 401 (Unauthorized)

## Frontend Components

### Core Components

**Authentication Components**
- `LoginForm`: User login interface with validation
- `RegisterForm`: User registration form with error handling
- `ProtectedRoute`: Route wrapper for authenticated pages

**Book Management Components**
- `BooksPage`: Main book discovery and listing page
- `BookDetail`: Detailed book view with reviews
- `CreateBookForm`: Form for adding new books to the database
- `BookSearchFilter`: Advanced search and filtering interface

**Review System Components**
- `ReviewForm`: Review creation and editing interface
- `ReviewList`: Display list of reviews with pagination
- `LikeButton`: Like/unlike functionality for reviews
- `CommentSection`: Comment system for reviews
- `CommentForm`: Comment creation and editing
- `CommentItem`: Individual comment display

**User Interface Components**
- `UserProfile`: User profile display and management
- `FollowButton`: Follow/unfollow button with state management
- `UserSearchWidget`: User search and discovery
- `NavigationHeader`: Main application navigation
- `Dashboard`: User dashboard with statistics

**Utility Components**
- `ReadingStatusButton`: Reading progress tracking interface
- `LibraryStatsWidget`: Reading statistics display
- `LoadingSpinner`: Loading state indicator
- `ErrorBoundary`: Error handling and display

### Component Architecture

Components follow a hierarchical structure with clear separation of concerns:

- **Container Components**: Handle state management and API calls
- **Presentation Components**: Focus on UI rendering and user interaction
- **Utility Components**: Provide reusable functionality across the application
- **HOC Components**: Higher-order components for cross-cutting concerns

### State Management

The application uses React Context API for global state management:

- **AuthContext**: Manages user authentication state and methods
- **Local State**: Component-level state for form inputs and UI interactions
- **Custom Hooks**: Reusable state logic for common patterns

## Project Structure

bookreviews-platform/
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ │ ├── authController.js
│ │ │ ├── bookController.js
│ │ │ ├── reviewController.js
│ │ │ ├── followController.js
│ │ │ └── userController.js
│ │ ├── middleware/
│ │ │ ├── auth.js
│ │ │ └── validation.js
│ │ ├── routes/
│ │ │ ├── authRoutes.js
│ │ │ ├── bookRoutes.js
│ │ │ ├── reviewRoutes.js
│ │ │ ├── followRoutes.js
│ │ │ └── userRoutes.js
│ │ ├── database/
│ │ │ ├── connection.js
│ │ │ └── migrations/
│ │ ├── utils/
│ │ └── app.js
│ ├── package.json
│ └── server.js
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── auth/
│ │ │ ├── books/
│ │ │ ├── reviews/
│ │ │ ├── social/
│ │ │ ├── comments/
│ │ │ └── common/
│ │ ├── pages/
│ │ │ ├── books/
│ │ │ ├── library/
│ │ │ └── users/
│ │ ├── context/
│ │ │ └── AuthContext.jsx
│ │ ├── services/
│ │ │ └── api.js
│ │ ├── styles/
│ │ │ └── global.css
│ │ ├── utils/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── package.json
│ └── index.html
├── README.md
├── .gitignore
└── package.json


## Usage Guide

### Getting Started

1. **Create an Account**: Register with username, email, and password
2. **Discover Books**: Browse the book catalog or use search functionality
3. **Add Books**: Contribute to the community by adding new books
4. **Write Reviews**: Share your thoughts and rate books you've read
5. **Track Progress**: Manage your reading status for different books
6. **Connect with Others**: Follow users with similar reading interests

### User Workflow

**For New Users**
1. Registration and account setup
2. Profile customization with bio and preferences
3. Exploring the book catalog and featured content
4. Adding first books to personal library
5. Writing initial reviews and engaging with the community

**For Active Users**
1. Daily browsing of new books and reviews
2. Updating reading progress and status
3. Engaging with community through comments and likes
4. Following new users and discovering recommendations
5. Regular review writing and community participation

### Administrative Features

**Content Moderation**
- Review and comment moderation capabilities
- User account management and suspension
- Book catalog management and curation
- System analytics and usage statistics

## Authentication Flow

### Registration Process

1. User submits registration form with required information
2. Server validates input data and checks for existing accounts
3. Password is hashed using bcrypt with salt rounds
4. User account is created in the database
5. JWT token is generated and returned to client
6. Client stores token and redirects to dashboard

### Login Process

1. User submits credentials (email/password)
2. Server validates credentials against database
3. Password verification using bcrypt comparison
4. JWT token generation with user payload
5. Token returned to client with user information
6. Client authentication state updated

### Token Management

- JWT tokens include user ID, username, and expiration
- Tokens are automatically validated on protected routes
- Refresh token mechanism for extended sessions
- Secure token storage with httpOnly cookies option
- Automatic logout on token expiration

## Contributing

We welcome contributions from the community! Please follow these guidelines:

### Development Process

1. **Fork the Repository**: Create a personal fork of the project
2. **Create Feature Branch**: `git checkout -b feature/your-feature-name`
3. **Make Changes**: Implement your feature or bug fix
4. **Write Tests**: Add appropriate unit and integration tests
5. **Update Documentation**: Ensure README and code comments are current
6. **Submit Pull Request**: Create a detailed PR with description of changes

### Code Standards

**JavaScript/React**
- Use ES6+ syntax and features
- Follow React best practices and hooks patterns
- Implement proper error handling and loading states
- Write meaningful component and function names
- Add JSDoc comments for complex functions

**Database**
- Follow normalization principles
- Use appropriate indexing for performance
- Implement proper foreign key constraints
- Write efficient queries with minimal N+1 problems

**API Design**
- Follow RESTful conventions
- Use appropriate HTTP status codes
- Implement consistent error response format
- Add proper request validation and sanitization

### Testing Guidelines

- Write unit tests for utility functions
- Create integration tests for API endpoints
- Add component tests for React components
- Ensure minimum 80% code coverage
- Test error scenarios and edge cases

## Testing

### Backend Testing

Run all backend tests

cd backend
npm test
Run tests with coverage

npm run test:coverage
Run integration tests

npm run test:integration


### Frontend Testing

Run all frontend tests

cd frontend
npm test
Run tests in watch mode

npm run test:watch
Generate test coverage report

npm run test:coverage


### End-to-End Testing

Run E2E tests (requires both servers running)

npm run test:e2e


## Deployment

### Production Build

**Backend Deployment**

cd backend
npm run build
npm start


**Frontend Deployment**

cd frontend
npm run build
Deploy dist/ folder to static hosting service



### Environment Configuration

**Production Environment Variables**


NODE_ENV=production
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=secure-production-secret
CORS_ORIGIN=https://your-domain.com


### Deployment Platforms

**Recommended Hosting Solutions**
- **Backend**: Railway, Heroku, DigitalOcean, AWS EC2
- **Frontend**: Vercel, Netlify, AWS S3 + CloudFront
- **Database**: Railway PostgreSQL, AWS RDS, Google Cloud SQL

### Performance Optimizations

- Enable gzip compression for API responses
- Implement database connection pooling
- Use CDN for static assets and images
- Enable caching headers for appropriate routes
- Monitor application performance and error rates

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, subject to appropriate attribution and license inclusion.

---

**BookReviews Platform** - Built with passion for the reading community. Happy reading and reviewing!

For questions, issues, or contributions, please visit our [GitHub repository](https://github.com/Somsid@2014/bookreviews-platform) or contact the development team.



