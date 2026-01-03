const express = require('express');
const cors = require('cors');

const app = express();

// ============================================================================
// Middleware Setup
// ============================================================================

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true }));

// ============================================================================
// Health Check Routes
// ============================================================================

/**
 * GET /
 * Root endpoint for basic health check
 * Returns success status
 */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Nexora Backend is running',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /api/health
 * Detailed health check endpoint
 * Returns service status and uptime information
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Health check passed',
    service: 'nexora-backend',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============================================================================
// Route Implementations (Placeholder Comments)
// ============================================================================

// TODO: Implement authentication routes
// - POST /api/auth/register - User registration
// - POST /api/auth/login - User login
// - POST /api/auth/logout - User logout
// - POST /api/auth/refresh-token - Token refresh

// TODO: Implement user routes
// - GET /api/users - Fetch all users (admin only)
// - GET /api/users/:id - Fetch user by ID
// - PUT /api/users/:id - Update user profile
// - DELETE /api/users/:id - Delete user account

// TODO: Implement product routes
// - GET /api/products - Fetch all products with pagination/filtering
// - GET /api/products/:id - Fetch product by ID
// - POST /api/products - Create new product (admin only)
// - PUT /api/products/:id - Update product (admin only)
// - DELETE /api/products/:id - Delete product (admin only)

// TODO: Implement order routes
// - GET /api/orders - Fetch user orders
// - GET /api/orders/:id - Fetch order by ID
// - POST /api/orders - Create new order
// - PUT /api/orders/:id - Update order status (admin only)
// - DELETE /api/orders/:id - Cancel order

// TODO: Implement cart routes
// - GET /api/cart - Fetch user's cart
// - POST /api/cart/items - Add item to cart
// - PUT /api/cart/items/:itemId - Update cart item quantity
// - DELETE /api/cart/items/:itemId - Remove item from cart
// - DELETE /api/cart - Clear entire cart

// TODO: Implement payment routes
// - POST /api/payments - Process payment
// - GET /api/payments/:id - Fetch payment details
// - POST /api/payments/:id/refund - Process refund

// TODO: Implement review routes
// - GET /api/reviews - Fetch all reviews with pagination
// - GET /api/reviews/:id - Fetch review by ID
// - POST /api/reviews - Create new review
// - PUT /api/reviews/:id - Update review
// - DELETE /api/reviews/:id - Delete review

// TODO: Implement category routes
// - GET /api/categories - Fetch all categories
// - POST /api/categories - Create category (admin only)
// - PUT /api/categories/:id - Update category (admin only)
// - DELETE /api/categories/:id - Delete category (admin only)

// ============================================================================
// 404 Handler - Route Not Found
// ============================================================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// ============================================================================
// Global Error Handling Middleware
// ============================================================================

/**
 * Centralized error handling middleware
 * Catches all errors thrown in route handlers and async operations
 * Formats error responses consistently
 * 
 * Error object should contain:
 * - statusCode (default: 500)
 * - message (error message)
 * - details (optional: additional error details)
 */
app.use((err, req, res, next) => {
  // Default error values
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || null;

  // Log error for debugging (in production, use a proper logging service)
  console.error({
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.originalUrl,
    statusCode,
    message,
    stack: err.stack
  });

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(details && { details }),
    timestamp: new Date().toISOString()
  });
});

// ============================================================================
// Export App
// ============================================================================

module.exports = app;
