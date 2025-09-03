# MemeWarpAI API Documentation

This document provides comprehensive documentation for the MemeWarpAI API, including authentication, endpoints, request/response formats, and error handling.

## Table of Contents

1. [Authentication](#authentication)
2. [Meme Operations](#meme-operations)
3. [User Operations](#user-operations)
4. [Payment Operations](#payment-operations)
5. [Error Handling](#error-handling)
6. [Third-Party Integrations](#third-party-integrations)

## Authentication

MemeWarpAI uses Firebase Authentication for user management and JWT tokens for API authentication.

### Authentication Methods

- Email/Password Authentication
- Wallet Authentication (Web3)

### JWT Authentication

All API requests (except public endpoints) must include an Authorization header with a valid JWT token:

```
Authorization: Bearer <token>
```

### Example: Obtaining a JWT Token

```javascript
// Email/Password Authentication
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});

const { token } = await response.json();
```

```javascript
// Wallet Authentication
const response = await fetch('/api/auth/wallet', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    walletAddress: '0x...',
    signature: '0x...'
  })
});

const { token } = await response.json();
```

## Meme Operations

### Create Meme

Creates a new meme with the provided image and text.

**Endpoint:** `POST /api/memes`

**Authentication:** Required

**Request Body:**

```json
{
  "imageUrl": "https://example.com/image.jpg",
  "topText": "When you finally",
  "bottomText": "understand the API docs",
  "isPublic": true,
  "tags": ["funny", "programming"]
}
```

**Response:**

```json
{
  "success": true,
  "memeId": "abc123",
  "meme": {
    "memeId": "abc123",
    "userId": "user123",
    "imageUrl": "https://example.com/image.jpg",
    "topText": "When you finally",
    "bottomText": "understand the API docs",
    "createdAt": "2023-09-03T12:34:56Z",
    "updatedAt": "2023-09-03T12:34:56Z",
    "shareCount": 0,
    "isPublic": true,
    "tags": ["funny", "programming"]
  }
}
```

### Get Meme

Retrieves a meme by its ID.

**Endpoint:** `GET /api/memes/:memeId`

**Authentication:** Required for private memes, optional for public memes

**Response:**

```json
{
  "success": true,
  "meme": {
    "memeId": "abc123",
    "userId": "user123",
    "imageUrl": "https://example.com/image.jpg",
    "topText": "When you finally",
    "bottomText": "understand the API docs",
    "createdAt": "2023-09-03T12:34:56Z",
    "updatedAt": "2023-09-03T12:34:56Z",
    "shareCount": 5,
    "isPublic": true,
    "tags": ["funny", "programming"]
  }
}
```

### Update Meme

Updates an existing meme.

**Endpoint:** `PUT /api/memes/:memeId`

**Authentication:** Required (must be the meme owner)

**Request Body:**

```json
{
  "topText": "When the code",
  "bottomText": "actually works on the first try",
  "isPublic": true,
  "tags": ["funny", "programming", "miracle"]
}
```

**Response:**

```json
{
  "success": true,
  "memeId": "abc123",
  "meme": {
    "memeId": "abc123",
    "userId": "user123",
    "imageUrl": "https://example.com/image.jpg",
    "topText": "When the code",
    "bottomText": "actually works on the first try",
    "createdAt": "2023-09-03T12:34:56Z",
    "updatedAt": "2023-09-03T13:45:67Z",
    "shareCount": 5,
    "isPublic": true,
    "tags": ["funny", "programming", "miracle"]
  }
}
```

### Delete Meme

Deletes a meme.

**Endpoint:** `DELETE /api/memes/:memeId`

**Authentication:** Required (must be the meme owner)

**Response:**

```json
{
  "success": true,
  "memeId": "abc123"
}
```

### Get User Memes

Retrieves all memes created by a user.

**Endpoint:** `GET /api/users/:userId/memes`

**Authentication:** Required (must be the user or an admin)

**Query Parameters:**
- `limit` (optional): Maximum number of memes to return (default: 50)
- `offset` (optional): Number of memes to skip (for pagination)
- `sort` (optional): Sort field (e.g., "createdAt", "shareCount")
- `order` (optional): Sort order ("asc" or "desc", default: "desc")

**Response:**

```json
{
  "success": true,
  "memes": [
    {
      "memeId": "abc123",
      "userId": "user123",
      "imageUrl": "https://example.com/image.jpg",
      "topText": "When the code",
      "bottomText": "actually works on the first try",
      "createdAt": "2023-09-03T12:34:56Z",
      "updatedAt": "2023-09-03T13:45:67Z",
      "shareCount": 5,
      "isPublic": true,
      "tags": ["funny", "programming", "miracle"]
    },
    // More memes...
  ],
  "total": 42,
  "limit": 10,
  "offset": 0
}
```

### Track Meme Share

Increments the share count for a meme.

**Endpoint:** `POST /api/memes/:memeId/share`

**Authentication:** Optional

**Request Body:**

```json
{
  "platform": "twitter"
}
```

**Response:**

```json
{
  "success": true,
  "memeId": "abc123",
  "shareCount": 6
}
```

## User Operations

### Create User

Creates a new user account.

**Endpoint:** `POST /api/users`

**Authentication:** None

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "username": "mememaster"
}
```

**Response:**

```json
{
  "success": true,
  "userId": "user123",
  "token": "jwt-token-here"
}
```

### Get User Profile

Retrieves a user's profile information.

**Endpoint:** `GET /api/users/:userId`

**Authentication:** Required (must be the user or an admin)

**Response:**

```json
{
  "success": true,
  "user": {
    "userId": "user123",
    "username": "mememaster",
    "email": "user@example.com",
    "createdAt": "2023-09-01T10:20:30Z",
    "updatedAt": "2023-09-02T11:22:33Z",
    "credits": 25,
    "memeCount": 42
  }
}
```

### Update User Profile

Updates a user's profile information.

**Endpoint:** `PUT /api/users/:userId`

**Authentication:** Required (must be the user)

**Request Body:**

```json
{
  "username": "meme_wizard",
  "email": "new_email@example.com"
}
```

**Response:**

```json
{
  "success": true,
  "userId": "user123",
  "user": {
    "userId": "user123",
    "username": "meme_wizard",
    "email": "new_email@example.com",
    "createdAt": "2023-09-01T10:20:30Z",
    "updatedAt": "2023-09-03T14:25:36Z",
    "credits": 25,
    "memeCount": 42
  }
}
```

## Payment Operations

### Create Payment Session

Creates a new payment session for purchasing credits.

**Endpoint:** `POST /api/payments/session`

**Authentication:** Required

**Request Body:**

```json
{
  "packageId": "standard",
  "amount": "$10.00",
  "metadata": {
    "credits": 50
  }
}
```

**Response:**

```json
{
  "success": true,
  "sessionId": "pay_123456",
  "amount": "$10.00",
  "credits": 50,
  "redirectUrl": "https://payments.example.com/checkout/pay_123456"
}
```

### Get Payment History

Retrieves a user's payment history.

**Endpoint:** `GET /api/users/:userId/payments`

**Authentication:** Required (must be the user or an admin)

**Response:**

```json
{
  "success": true,
  "payments": [
    {
      "id": "pay_123456",
      "amount": "$10.00",
      "credits": 50,
      "timestamp": "2023-09-03T12:34:56Z",
      "status": "completed"
    },
    // More payments...
  ]
}
```

### Add Credits

Adds credits to a user's account.

**Endpoint:** `POST /api/users/:userId/credits`

**Authentication:** Required (must be the user or an admin)

**Request Body:**

```json
{
  "amount": 50,
  "transactionId": "pay_123456"
}
```

**Response:**

```json
{
  "success": true,
  "userId": "user123",
  "credits": 75,
  "transaction": {
    "id": "pay_123456",
    "amount": 50,
    "type": "credit_purchase",
    "timestamp": "2023-09-03T12:34:56Z"
  }
}
```

### Use Credits

Uses credits from a user's account.

**Endpoint:** `POST /api/users/:userId/credits/use`

**Authentication:** Required (must be the user)

**Request Body:**

```json
{
  "amount": 1,
  "purpose": "meme_generation"
}
```

**Response:**

```json
{
  "success": true,
  "userId": "user123",
  "credits": 74,
  "transaction": {
    "id": "use_123456",
    "amount": 1,
    "type": "credit_usage",
    "purpose": "meme_generation",
    "timestamp": "2023-09-03T12:45:67Z"
  }
}
```

## Error Handling

All API endpoints return standard error responses with appropriate HTTP status codes.

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "invalid_request",
    "message": "The request was invalid",
    "details": "Field 'topText' is required"
  }
}
```

### Common Error Codes

- `authentication_required`: Authentication is required for this endpoint
- `invalid_credentials`: Invalid email/password or wallet signature
- `insufficient_permissions`: User does not have permission to perform this action
- `resource_not_found`: The requested resource was not found
- `invalid_request`: The request was invalid or malformed
- `insufficient_credits`: User does not have enough credits
- `rate_limit_exceeded`: Rate limit has been exceeded
- `internal_error`: An internal server error occurred

## Third-Party Integrations

### OpenAI Integration

MemeWarpAI uses OpenAI's API for generating meme captions.

**Endpoint:** `POST /api/ai/generate-captions`

**Authentication:** Required

**Request Body:**

```json
{
  "imageUrl": "https://example.com/image.jpg",
  "style": "funny",
  "count": 3
}
```

**Response:**

```json
{
  "success": true,
  "captions": [
    "When you realize it's only Tuesday",
    "That moment when your code compiles",
    "Me pretending to understand the meeting"
  ],
  "analysis": "The image shows a person with a surprised expression..."
}
```

### Social Media Sharing

MemeWarpAI provides endpoints for sharing memes to various social media platforms.

**Endpoint:** `POST /api/share/:platform`

**Authentication:** Required

**Supported Platforms:**
- `twitter`
- `facebook`
- `instagram`
- `farcaster`

**Request Body:**

```json
{
  "memeId": "abc123",
  "text": "Check out this hilarious meme I made with #MemeWarpAI!"
}
```

**Response:**

```json
{
  "success": true,
  "shareUrl": "https://twitter.com/intent/tweet?text=..."
}
```

