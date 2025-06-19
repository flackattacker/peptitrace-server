# PeptiTrace Server

Backend server for the PeptiTrace application, providing APIs for peptide tracking and experience sharing.

## Features

- User authentication and authorization
- Peptide information management
- Experience tracking and sharing
- Analytics and reporting
- RESTful API endpoints

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone https://github.com/flackattacker/peptitrace-server.git
cd peptitrace-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Users
- GET /api/users - Get all users
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user

### Peptides
- GET /api/peptides - Get all peptides
- GET /api/peptides/:id - Get peptide by ID
- POST /api/peptides - Create new peptide
- PUT /api/peptides/:id - Update peptide
- DELETE /api/peptides/:id - Delete peptide

### Experiences
- GET /api/experiences - Get all experiences
- GET /api/experiences/:id - Get experience by ID
- POST /api/experiences - Create new experience
- PUT /api/experiences/:id - Update experience
- DELETE /api/experiences/:id - Delete experience

### Analytics
- GET /api/analytics - Get usage analytics
- GET /api/analytics/peptide-trends - Get peptide trends
- GET /api/analytics/effectiveness - Get peptide effectiveness data

## Development

- `npm run dev` - Start development server with hot reload
- `npm test` - Run tests
- `npm start` - Start production server

## License

MIT 