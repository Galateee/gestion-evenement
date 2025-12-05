# 🌐 API Endpoints

Documentation des endpoints REST disponibles.

## 📌 Base URL

```
http://localhost:3000
```

## 🔐 Authentication

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe",
  "role": "PARTICIPANT"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "PARTICIPANT",
    "createdAt": "2025-12-05T10:00:00.000Z"
  }
}
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "PARTICIPANT"
    }
  }
}
```

---

## 🎭 Events

### Get All Events

```http
GET /events?page=1&limit=10&category=CONCERT&status=PUBLISHED
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "uuid",
        "title": "Concert de Jazz",
        "description": "Une soirée inoubliable",
        "category": "CONCERT",
        "status": "PUBLISHED",
        "organizerId": "uuid",
        "startDate": "2025-12-20T20:00:00.000Z",
        "endDate": "2025-12-20T23:00:00.000Z",
        "location": "Salle Pleyel, Paris",
        "capacity": 500,
        "availableSeats": 350,
        "basePrice": 45.00,
        "imageUrl": "https://example.com/image.jpg",
        "createdAt": "2025-12-05T10:00:00.000Z",
        "updatedAt": "2025-12-05T10:00:00.000Z"
      }
    ],
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### Get Event by ID

```http
GET /events/{id}
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Concert de Jazz",
    "description": "Une soirée inoubliable",
    "category": "CONCERT",
    "status": "PUBLISHED",
    "organizerId": "uuid",
    "startDate": "2025-12-20T20:00:00.000Z",
    "endDate": "2025-12-20T23:00:00.000Z",
    "location": "Salle Pleyel, Paris",
    "capacity": 500,
    "availableSeats": 350,
    "basePrice": 45.00,
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2025-12-05T10:00:00.000Z",
    "updatedAt": "2025-12-05T10:00:00.000Z"
  }
}
```

### Create Event

```http
POST /events
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Concert de Jazz",
  "description": "Une soirée inoubliable de jazz avec les meilleurs artistes",
  "category": "CONCERT",
  "organizerId": "uuid",
  "startDate": "2025-12-20T20:00:00.000Z",
  "endDate": "2025-12-20T23:00:00.000Z",
  "location": "Salle Pleyel, Paris",
  "capacity": 500,
  "basePrice": 45.00,
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Concert de Jazz",
    "status": "DRAFT",
    "availableSeats": 500,
    "createdAt": "2025-12-05T10:00:00.000Z",
    "updatedAt": "2025-12-05T10:00:00.000Z"
  }
}
```

### Update Event

```http
PUT /events/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Concert de Jazz - Edition 2025",
  "status": "PUBLISHED",
  "basePrice": 50.00
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Concert de Jazz - Edition 2025",
    "status": "PUBLISHED",
    "basePrice": 50.00,
    "updatedAt": "2025-12-05T11:00:00.000Z"
  }
}
```

### Cancel Event

```http
DELETE /events/{id}
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Event cancelled successfully"
}
```

---

## 🎟️ Tickets

### Get My Tickets

```http
GET /tickets/my-tickets
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "eventId": "uuid",
      "userId": "uuid",
      "ticketType": "STANDARD",
      "quantity": 2,
      "totalPrice": 90.00,
      "status": "PAID",
      "qrCode": "data:image/png;base64,iVBORw0KG...",
      "event": {
        "title": "Concert de Jazz",
        "startDate": "2025-12-20T20:00:00.000Z",
        "location": "Salle Pleyel, Paris"
      },
      "createdAt": "2025-12-05T10:00:00.000Z"
    }
  ]
}
```

### Book Ticket

```http
POST /tickets
Authorization: Bearer {token}
Content-Type: application/json

{
  "eventId": "uuid",
  "ticketType": "STANDARD",
  "quantity": 2
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "eventId": "uuid",
    "userId": "uuid",
    "ticketType": "STANDARD",
    "quantity": 2,
    "totalPrice": 90.00,
    "status": "PENDING_PAYMENT",
    "createdAt": "2025-12-05T10:00:00.000Z"
  }
}
```

### Cancel Ticket

```http
DELETE /tickets/{id}
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Ticket cancelled successfully. Refund will be processed."
}
```

---

## 💳 Payments

### Process Payment

```http
POST /payments
Authorization: Bearer {token}
Content-Type: application/json

{
  "ticketId": "uuid",
  "amount": 90.00,
  "currency": "EUR",
  "paymentMethod": "CREDIT_CARD",
  "paymentDetails": {
    "cardToken": "tok_visa"
  }
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "ticketId": "uuid",
    "userId": "uuid",
    "amount": 90.00,
    "currency": "EUR",
    "status": "CONFIRMED",
    "paymentMethod": "CREDIT_CARD",
    "transactionId": "pi_xxx",
    "createdAt": "2025-12-05T10:00:00.000Z"
  }
}
```

### Get Payment History

```http
GET /payments/history
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "amount": 90.00,
      "currency": "EUR",
      "status": "CONFIRMED",
      "paymentMethod": "CREDIT_CARD",
      "createdAt": "2025-12-05T10:00:00.000Z",
      "ticket": {
        "event": {
          "title": "Concert de Jazz"
        }
      }
    }
  ]
}
```

### Request Refund

```http
POST /payments/{id}/refund
Authorization: Bearer {token}
Content-Type: application/json

{
  "reason": "Event cancelled"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "refundId": "uuid",
    "amount": 90.00,
    "status": "REFUNDED",
    "reason": "Event cancelled",
    "processedAt": "2025-12-05T11:00:00.000Z"
  }
}
```

---

## 👤 Users

### Get My Profile

```http
GET /users/profile
Authorization: Bearer {token}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "PARTICIPANT",
    "createdAt": "2025-12-05T10:00:00.000Z",
    "statistics": {
      "eventsAttended": 5,
      "upcomingEvents": 2,
      "totalSpent": 450.00
    }
  }
}
```

### Update Profile

```http
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Updated Doe",
  "phone": "+33123456789"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Updated Doe",
    "phone": "+33123456789",
    "updatedAt": "2025-12-05T11:00:00.000Z"
  }
}
```

---

## 📊 Admin Endpoints

### Get All Users (Admin only)

```http
GET /admin/users
Authorization: Bearer {admin-token}
```

**Response 200:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "PARTICIPANT",
      "createdAt": "2025-12-05T10:00:00.000Z"
    }
  ]
}
```

### Get Platform Statistics

```http
GET /admin/statistics
Authorization: Bearer {admin-token}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "totalUsers": 1543,
    "totalEvents": 234,
    "totalTicketsSold": 5678,
    "totalRevenue": 123456.78,
    "monthlyRevenue": 12345.67,
    "topEvents": [
      {
        "id": "uuid",
        "title": "Concert de Jazz",
        "ticketsSold": 450,
        "revenue": 20250.00
      }
    ]
  }
}
```

---

## ❌ Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    "email must be a valid email address",
    "password must be at least 8 characters"
  ]
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Unauthorized",
  "error": "Invalid or expired token"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "Forbidden",
  "error": "You don't have permission to access this resource"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Not Found",
  "error": "Event with ID 'xxx' not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal Server Error",
  "error": "An unexpected error occurred"
}
```

---

## 🧪 Testing with cURL

### Example: Complete Booking Flow

```bash
# 1. Register
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "name": "Test User",
    "role": "PARTICIPANT"
  }'

# 2. Login
TOKEN=$(curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!"
  }' | jq -r '.data.accessToken')

# 3. Get Events
curl -X GET http://localhost:3000/events \
  -H "Authorization: Bearer $TOKEN"

# 4. Book Ticket
TICKET_ID=$(curl -X POST http://localhost:3000/tickets \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "event-uuid",
    "ticketType": "STANDARD",
    "quantity": 2
  }' | jq -r '.data.id')

# 5. Process Payment
curl -X POST http://localhost:3000/payments \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "'$TICKET_ID'",
    "amount": 90.00,
    "currency": "EUR",
    "paymentMethod": "CREDIT_CARD"
  }'

# 6. Get My Tickets
curl -X GET http://localhost:3000/tickets/my-tickets \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📝 Notes

- Tous les endpoints nécessitent un token JWT sauf `/auth/register` et `/auth/login`
- Les dates sont au format ISO 8601
- Les montants sont en décimales (ex: 45.00)
- La pagination par défaut : page=1, limit=10
