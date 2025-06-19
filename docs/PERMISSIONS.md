# PeptiTrace Permission System

## Overview

PeptiTrace implements a comprehensive role-based access control (RBAC) system with three user roles and granular permissions for different data operations.

## User Roles

### 1. User (Default)
- **Status**: `pending` → `approved` → `rejected`
- **Default Role**: `user`
- **Permissions**: Basic platform access with limited data operations

### 2. Moderator
- **Role**: `moderator`
- **Permissions**: Enhanced access for content moderation and user management
- **Status**: Must be `approved`

### 3. Admin
- **Role**: `admin`
- **Permissions**: Full system access including data deletion
- **Status**: Must be `approved`

## Permission Matrix

### Experience Permissions

| Operation | User | Moderator | Admin | Notes |
|-----------|------|-----------|-------|-------|
| **Create** | ✅ | ✅ | ✅ | Rate limited (5/20/50 per 24h) |
| **Read** | ✅ | ✅ | ✅ | All active experiences |
| **Update** | ✅* | ✅ | ✅ | *Only own experiences |
| **Delete** | ✅* | ✅ | ✅ | *Only own experiences |
| **Moderate** | ❌ | ✅ | ✅ | Content moderation |

### Peptide Permissions

| Operation | User | Moderator | Admin | Notes |
|-----------|------|-----------|-------|-------|
| **Create** | ❌ | ✅ | ✅ | Add new peptides |
| **Read** | ✅ | ✅ | ✅ | All peptides |
| **Update** | ❌ | ✅ | ✅ | Edit peptide info |
| **Delete** | ❌ | ❌ | ✅ | Remove peptides |
| **Moderate** | ❌ | ✅ | ✅ | Peptide management |

### User Management Permissions

| Operation | User | Moderator | Admin | Notes |
|-----------|------|-----------|-------|-------|
| **Create** | ❌ | ✅ | ✅ | Register new users |
| **Read** | ✅* | ✅ | ✅ | *Only own profile |
| **Update** | ✅* | ✅ | ✅ | *Only own profile |
| **Delete** | ❌ | ❌ | ✅ | Remove users |
| **Moderate** | ❌ | ✅ | ✅ | Approve/reject users |

### Analytics Permissions

| Operation | User | Moderator | Admin | Notes |
|-----------|------|-----------|-------|-------|
| **Read** | ❌ | ✅ | ✅ | View analytics |
| **Export** | ❌ | ✅ | ✅ | Export data |

## Rate Limiting

### Experience Submissions
- **Users**: 5 submissions per 24 hours
- **Moderators**: 20 submissions per 24 hours
- **Admins**: 50 submissions per 24 hours

### API Rate Limits
- **Authentication**: 10 attempts per minute
- **General API**: 100 requests per minute per user

## Security Features

### 1. Authentication
- JWT-based authentication with access and refresh tokens
- Token expiration: 1 hour (access), 7 days (refresh)
- Automatic token refresh on expiration

### 2. Authorization
- Role-based middleware for all protected routes
- Resource ownership validation for user data
- Granular permission checks per operation

### 3. Data Protection
- Users can only access/modify their own data
- Soft deletion for experiences (isActive flag)
- Audit trail for user management actions

### 4. Input Validation
- Honeypot fields for spam prevention
- Input sanitization and validation
- SQL injection prevention through parameterized queries

## API Endpoints by Permission Level

### Public Endpoints (No Authentication)
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login

### User-Level Endpoints (Authenticated Users)
- `GET /api/experiences` - View experiences
- `POST /api/experiences` - Submit experiences (rate limited)
- `PUT /api/experiences/:id` - Update own experiences
- `DELETE /api/experiences/:id` - Delete own experiences
- `GET /api/peptides` - View peptides
- `GET /api/users/me` - View own profile
- `PUT /api/users/me` - Update own profile

### Moderator-Level Endpoints
- All user-level endpoints
- `GET /api/users/pending` - View pending users
- `POST /api/users/:id/approve` - Approve users
- `POST /api/users/:id/reject` - Reject users
- `GET /api/analytics/*` - View analytics
- `GET /api/analytics/export` - Export data
- `POST /api/peptides` - Create peptides
- `PUT /api/peptides/:id` - Update peptides

### Admin-Level Endpoints
- All moderator-level endpoints
- `DELETE /api/peptides/:id` - Delete peptides
- `DELETE /api/users/:id` - Delete users
- Full system access

## Implementation Details

### Middleware Functions

```javascript
// Basic authentication
authenticateToken(req, res, next)

// Role-based access control
requireAuth(req, res, next)
requireModerator(req, res, next)
requireAdmin(req, res, next)

// Granular permissions
requireDataPermission(operation, resource)(req, res, next)

// Rate limiting
rateLimitExperienceSubmission(req, res, next)
```

### Permission Matrix Definition

```javascript
const permissions = {
  'experience': {
    'create': ['user', 'moderator', 'admin'],
    'read': ['user', 'moderator', 'admin'],
    'update': ['user', 'moderator', 'admin'],
    'delete': ['user', 'moderator', 'admin'],
    'moderate': ['moderator', 'admin']
  },
  'peptide': {
    'create': ['moderator', 'admin'],
    'read': ['user', 'moderator', 'admin'],
    'update': ['moderator', 'admin'],
    'delete': ['admin'],
    'moderate': ['moderator', 'admin']
  },
  'user': {
    'create': ['moderator', 'admin'],
    'read': ['user', 'moderator', 'admin'],
    'update': ['user', 'moderator', 'admin'],
    'delete': ['admin'],
    'moderate': ['moderator', 'admin']
  },
  'analytics': {
    'read': ['moderator', 'admin'],
    'export': ['moderator', 'admin']
  }
};
```

## Best Practices

### 1. Always Check Permissions
- Use middleware for all protected routes
- Validate resource ownership before operations
- Implement proper error handling for permission failures

### 2. Rate Limiting
- Apply rate limits to prevent abuse
- Different limits for different user roles
- Monitor and log rate limit violations

### 3. Data Validation
- Validate all input data
- Sanitize user inputs
- Use parameterized queries

### 4. Audit Logging
- Log all permission-related actions
- Track user management operations
- Monitor for suspicious activity

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Insufficient permissions for [operation] on [resource]"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "message": "Rate limit exceeded. Maximum [limit] submissions per 24 hours."
}
```

## Future Enhancements

1. **Fine-grained Permissions**: More granular permission controls
2. **Permission Groups**: Custom permission groups for different use cases
3. **Temporary Permissions**: Time-limited elevated permissions
4. **Audit Dashboard**: Web interface for permission management
5. **API Key Management**: API keys for external integrations 