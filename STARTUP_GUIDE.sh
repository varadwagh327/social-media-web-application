#!/bin/bash

# Social Media Web Application - Complete Setup & Startup Guide

echo "========================================="
echo "🚀 Social Media Web Application"
echo "Setup & Startup Guide"
echo "========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print section headers
print_section() {
    echo -e "${BLUE}=========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}=========================================${NC}"
}

# Function to print success messages
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Function to print info messages
print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Part 1: Backend Setup & Installation
print_section "PART 1: Backend Setup"

print_info "Installing backend dependencies..."
cd Backend
npm install
print_success "Backend dependencies installed"

print_info "Creating .env file from example..."
if [ ! -f ".env" ]; then
    cp config/.env.example .env
    print_success ".env file created (update with your values)"
else
    print_success ".env file already exists"
fi

cd ..

# Part 2: Frontend Setup & Installation
print_section "PART 2: Frontend Setup"

print_info "Installing frontend dependencies..."
cd frontend
npm install
print_success "Frontend dependencies installed"

print_info "Creating .env.local file..."
cat > .env.local << 'EOF'
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=Social Media Platform
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_POSTS_PER_PAGE=20
EOF
print_success ".env.local file created"

cd ..

# Part 3: Database Setup
print_section "PART 3: Database Setup"

print_info "Starting MongoDB and Redis with Docker..."
print_info "Running: docker-compose up -d"
docker-compose up -d
print_success "Services started (MongoDB, Redis, PostgreSQL)"

sleep 5

# Part 4: Backend Server
print_section "PART 4: Starting Backend Server"

print_info "Starting Node.js backend on port 5000..."
print_info "Open new terminal and run: cd Backend && npm run dev"
echo ""
print_info "Backend will be available at: http://localhost:5000"
print_info "API base URL: http://localhost:5000/api/v1"
echo ""

# Part 5: Frontend Server
print_section "PART 5: Starting Frontend Server"

print_info "Starting Next.js frontend on port 3000..."
print_info "Open another new terminal and run: cd frontend && npm run dev"
echo ""
print_info "Frontend will be available at: http://localhost:3000"
echo ""

# Part 6: Verification
print_section "PART 6: Verify Installation"

echo ""
print_info "After starting both servers, verify the setup:"
echo ""
echo "1. Backend Health Check:"
echo "   curl http://localhost:5000/api/v1/health"
echo ""
echo "2. Test Signup:"
echo "   curl -X POST http://localhost:5000/api/v1/auth/signup \\"
echo "   -H 'Content-Type: application/json' \\"
echo "   -d '{\"username\":\"testuser\",\"email\":\"test@example.com\",\"password\":\"TestPassword123!\"}'"
echo ""
echo "3. Open Frontend:"
echo "   http://localhost:3000"
echo ""

# Part 7: Running Tests
print_section "PART 7: Running Tests"

echo ""
print_info "To run backend tests:"
echo "   cd Backend && npm test"
echo ""
print_info "To run backend tests with coverage:"
echo "   cd Backend && npm run test:coverage"
echo ""
print_info "To run frontend tests:"
echo "   cd frontend && npm test"
echo ""

# Part 8: Docker Deployment
print_section "PART 8: Full Docker Deployment"

echo ""
print_info "To run entire application with Docker:"
echo "   docker-compose up --build"
echo ""
print_info "To stop all services:"
echo "   docker-compose down"
echo ""
print_info "To view service logs:"
echo "   docker-compose logs -f"
echo ""

# Part 9: Common Issues & Solutions
print_section "PART 9: Troubleshooting"

echo ""
print_info "Port Already in Use:"
echo "   Linux/Mac: sudo lsof -i :5000 && kill -9 <PID>"
echo "   Windows: netstat -ano | findstr :5000"
echo ""
print_info "MongoDB Connection Failed:"
echo "   Check if MongoDB is running: docker ps"
echo "   Check MongoDB URI in .env file"
echo ""
print_info "CORS Errors:"
echo "   Ensure CORS_ORIGIN in .env matches frontend URL"
echo "   Default: http://localhost:3000"
echo ""
print_info "API Not Found (404):"
echo "   Check NEXT_PUBLIC_API_URL in frontend .env.local"
echo "   Verify backend is running on port 5000"
echo ""

# Part 10: Project Structure
print_section "PART 10: Project Structure"

echo ""
echo "Backend/"
echo "├── config/              # Configuration files"
echo "├── controller/          # Route handlers"
echo "├── database/            # Database connection"
echo "├── middlewares/         # Express middleware"
echo "├── models/              # MongoDB schemas"
echo "├── router/              # API routes"
echo "├── schemas/             # Joi validation schemas"
echo "├── services/            # Business logic"
echo "├── utils/               # Utility functions"
echo "├── tests/               # Test files"
echo "├── app.js               # Express app setup"
echo "├── server.js            # Server startup"
echo "└── package.json         # Dependencies"
echo ""
echo "frontend/"
echo "├── app/                 # Next.js pages and layout"
echo "├── components/          # React components"
echo "├── lib/"
echo "│   ├── api/            # API client functions"
echo "│   └── hooks/          # Custom React hooks"
echo "├── store/              # Redux store"
echo "│   ├── slices/         # Redux slices"
echo "│   └── types/          # TypeScript types"
echo "├── styles/             # Global styles"
echo "├── tests/              # Test files"
echo "└── package.json        # Dependencies"
echo ""

# Part 11: API Documentation
print_section "PART 11: API Documentation"

echo ""
print_info "For complete API documentation, see:"
echo "   Backend/API_DOCUMENTATION.md"
echo ""
print_info "For frontend-backend integration details, see:"
echo "   FRONTEND_BACKEND_INTEGRATION.md"
echo ""

# Final Message
print_section "✅ Setup Complete!"

echo ""
print_success "All steps completed successfully!"
echo ""
print_info "Next steps:"
echo "1. Start MongoDB and Redis: docker-compose up -d"
echo "2. Start Backend: cd Backend && npm run dev"
echo "3. Start Frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
print_info "For more information, see README.md and FRONTEND_BACKEND_INTEGRATION.md"
echo ""
