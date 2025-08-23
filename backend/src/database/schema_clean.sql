-- ===================================
-- BOOKREVIEWS DATABASE SCHEMA (SIMPLIFIED)
-- ===================================

-- Enable UUID extension for better unique IDs (optional but recommended)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===================================
-- CORE TABLES
-- ===================================

-- USERS TABLE (Simplified - removed avatar_url)
-- Stores all user accounts and profile information
CREATE TABLE users (
    id SERIAL PRIMARY KEY,                    -- Auto-incrementing user ID
    username VARCHAR(50) UNIQUE NOT NULL,     -- Unique username for login
    email VARCHAR(255) UNIQUE NOT NULL,       -- Email address (also unique)
    password_hash VARCHAR(255) NOT NULL,      -- Encrypted password (never store plain passwords!)
    display_name VARCHAR(100),                -- What others see (can be different from username)
    bio TEXT,                                -- User's bio/description
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- BOOKS TABLE (Simplified - removed isbn, publication_year, cover_url)
-- User-generated book entries (no external API dependency!)
CREATE TABLE books (
    id SERIAL PRIMARY KEY,                    -- Unique book ID
    title VARCHAR(500) NOT NULL,              -- Book title
    author VARCHAR(300),                      -- Author name(s)
    genre VARCHAR(100),                      -- Book genre/category
    description TEXT,                        -- Book description/summary
    created_by INTEGER REFERENCES users(id), -- Which user added this book
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- REVIEWS TABLE (Simplified - removed contains_spoilers, is_favorite)
-- The heart of our platform - user reviews and ratings
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,  -- Who wrote the review
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,  -- Which book was reviewed
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL, -- 1-5 star rating
    review_text TEXT,                        -- The actual review content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, book_id)                -- One review per user per book
);

-- ===================================
-- SOCIAL FEATURES TABLES
-- ===================================

-- FOLLOWS TABLE
-- Users can follow other users to see their activity
CREATE TABLE follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES users(id) ON DELETE CASCADE,   -- Who is following
    following_id INTEGER REFERENCES users(id) ON DELETE CASCADE,  -- Who is being followed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id),      -- Can't follow same person twice
    CHECK (follower_id != following_id)     -- Can't follow yourself
);

-- REVIEW_LIKES TABLE
-- Users can like reviews (similar to hearts/likes on social media)
CREATE TABLE review_likes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,    -- Who liked it
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE, -- Which review was liked
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, review_id)              -- Can't like same review twice
);

-- REVIEW_COMMENTS TABLE
-- Users can comment on reviews for discussions
CREATE TABLE review_comments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,     -- Who wrote the comment
    review_id INTEGER REFERENCES reviews(id) ON DELETE CASCADE, -- Which review was commented on
    comment_text TEXT NOT NULL,             -- The comment content
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===================================
-- LIBRARY MANAGEMENT TABLES
-- ===================================

-- READING_STATUS TABLE
-- Track what users are reading, want to read, have finished, etc.
CREATE TABLE reading_status (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    book_id INTEGER REFERENCES books(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL CHECK (status IN (
        'want_to_read',      -- Added to wishlist
        'currently_reading', -- Currently reading
        'finished',          -- Completed reading
        'did_not_finish'     -- Started but didn't finish
    )),
    started_date DATE,                      -- When they started reading
    finished_date DATE,                     -- When they finished
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, book_id)               -- One status per user per book
);

-- ===================================
-- PERFORMANCE INDEXES
-- ===================================

-- Basic indexes for common queries
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_books_created_by ON books(created_by);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_book_id ON reviews(book_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_follows_follower_id ON follows(follower_id);
CREATE INDEX idx_follows_following_id ON follows(following_id);
CREATE INDEX idx_reading_status_user_id ON reading_status(user_id);
CREATE INDEX idx_reading_status_book_id ON reading_status(book_id);
CREATE INDEX idx_reading_status_status ON reading_status(status);

-- Full-text search indexes (for searching books and reviews)
CREATE INDEX idx_books_title_search ON books USING GIN (to_tsvector('english', title));
CREATE INDEX idx_books_full_search ON books USING GIN (
    to_tsvector('english', 
        COALESCE(title, '') || ' ' || 
        COALESCE(author, '') || ' ' || 
        COALESCE(description, '')
    )
);
CREATE INDEX idx_reviews_search ON reviews USING GIN (
    to_tsvector('english', COALESCE(review_text, ''))
);

-- ===================================
-- AUTOMATIC TIMESTAMP UPDATES
-- ===================================

-- Function to update the 'updated_at' timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update timestamps when records are modified
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_books_updated_at 
    BEFORE UPDATE ON books 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at 
    BEFORE UPDATE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reading_status_updated_at 
    BEFORE UPDATE ON reading_status 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_comments_updated_at 
    BEFORE UPDATE ON review_comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
