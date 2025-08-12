# AI Therapy Agent - Full Stack Application

A modern mental health support application with a React/Next.js frontend (JSX) and Python FastAPI backend.

## Architecture

### Frontend (React/Next.js with JSX)
- **Framework**: Next.js 14
- **Language**: JavaScript with JSX (converted from TypeScript)
- **Styling**: Tailwind CSS with shadcn/ui components
- **Features**: 
  - Responsive landing page with emotion tracking
  - Authentication (login/register)
  - Mood tracking and visualization
  - Activity logging
  - AI chat interface

### Backend (Python FastAPI)
- **Framework**: FastAPI (converted from Node.js/Express)
- **Language**: Python 3.8+
- **Database**: MongoDB with Motor (async driver)
- **Authentication**: JWT tokens with bcrypt password hashing
- **Features**:
  - User registration and authentication
  - Mood tracking API
  - Activity logging API
  - Chat sessions with AI responses

## Project Structure

```
├── frontend/                 # Next.js frontend (JSX)
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components (JSX)
│   ├── lib/                 # Utilities and API clients
│   └── public/              # Static assets
├── backend_python/          # Python FastAPI backend
│   ├── routers/            # API route handlers
│   ├── models.py           # Pydantic models
│   ├── auth.py             # Authentication utilities
│   ├── database.py         # Database connection
│   ├── main.py             # FastAPI application
│   └── requirements.txt    # Python dependencies
└── backend/                # Original Node.js backend (deprecated)
```

## Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- MongoDB (local or cloud)

### Backend Setup (Python)

1. Navigate to the Python backend directory:
```bash
cd backend_python
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create environment file:
```bash
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secret
```

5. Start the server:
```bash
python main.py
# Or using uvicorn directly:
uvicorn main:app --reload --port 8000
```

The Python backend will be available at `http://localhost:8000`

### Frontend Setup (React/JSX)

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
cp .env.local.example .env.local
# Edit if needed - default points to localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user info

### Mood Tracking
- `POST /api/mood/` - Log a mood entry
- `GET /api/mood/` - Get mood history
- `GET /api/mood/latest` - Get latest mood entry
- `DELETE /api/mood/{mood_id}` - Delete a mood entry

### Activity Logging
- `POST /api/activity/` - Log an activity
- `GET /api/activity/` - Get activity history
- `GET /api/activity/{activity_id}` - Get specific activity
- `PUT /api/activity/{activity_id}` - Update an activity
- `DELETE /api/activity/{activity_id}` - Delete an activity

### Chat
- `POST /chat/` - Send a chat message
- `GET /chat/sessions` - Get chat sessions
- `GET /chat/sessions/{session_id}` - Get chat history
- `DELETE /chat/sessions/{session_id}` - Delete chat session

## Key Changes from Original

### Frontend Conversion (TypeScript → JSX)
- Removed all TypeScript type annotations
- Converted `.tsx` files to `.jsx`
- Updated imports and exports to use JavaScript syntax
- Removed TypeScript-specific configuration

### Backend Conversion (Node.js → Python)
- **Express.js → FastAPI**: Modern async Python web framework
- **Mongoose → Motor**: Async MongoDB driver for Python
- **bcryptjs → passlib**: Python password hashing library
- **jsonwebtoken → python-jose**: JWT handling in Python
- **TypeScript → Python**: Complete language change with type hints

### Database Models
- Converted Mongoose schemas to Pydantic models
- Maintained the same data structure and relationships
- Added proper validation and type checking

### API Structure
- Maintained RESTful API design
- Updated error handling to use FastAPI's HTTPException
- Added automatic API documentation via FastAPI's built-in Swagger UI

## Development

### Adding New Features

1. **Frontend**: Add new JSX components in `frontend/components/`
2. **Backend**: Add new routes in `backend_python/routers/`
3. **Database**: Update models in `backend_python/models.py`

### Testing

The API documentation is automatically available at:
- `http://localhost:8000/docs` (Swagger UI)
- `http://localhost:8000/redoc` (ReDoc)

### Database

Ensure MongoDB is running and accessible. The application will create collections automatically when first used.

## Deployment

### Backend (Python)
- Can be deployed to any platform supporting Python (Heroku, Railway, DigitalOcean, etc.)
- Requires MongoDB connection string in environment variables

### Frontend (Next.js)
- Can be deployed to Vercel, Netlify, or any platform supporting Node.js
- Update `NEXT_PUBLIC_API_URL` to point to your deployed backend

## Environment Variables

### Backend (.env)
```
MONGODB_URL=mongodb://localhost:27017
DB_NAME=ai_therapy_agent
JWT_SECRET=your-super-secret-jwt-key-here
PORT=8000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
