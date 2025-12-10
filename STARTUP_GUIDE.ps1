# Social Media Web Application - Complete Setup & Startup Guide (Windows)
# Run this script in PowerShell as Administrator

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "🚀 Social Media Web Application" -ForegroundColor Cyan
Write-Host "Setup & Startup Guide (Windows)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Function to print section headers
function Print-Section {
    param([string]$Title)
    Write-Host "=========================================" -ForegroundColor Blue
    Write-Host $Title -ForegroundColor Blue
    Write-Host "=========================================" -ForegroundColor Blue
}

# Function to print success messages
function Print-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

# Function to print info messages
function Print-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Yellow
}

# Check if Docker is installed
function Check-Docker {
    try {
        docker --version | Out-Null
        Print-Success "Docker is installed"
        return $true
    } catch {
        Print-Info "Docker is not installed. Please install Docker Desktop for Windows."
        return $false
    }
}

# Check if Node.js is installed
function Check-Node {
    try {
        node --version | Out-Null
        node --version
        Print-Success "Node.js is installed"
        return $true
    } catch {
        Print-Info "Node.js is not installed. Please install from https://nodejs.org/"
        return $false
    }
}

# Part 0: System Requirements Check
Print-Section "PART 0: System Requirements"

Print-Info "Checking system requirements..."
$nodeInstalled = Check-Node
$dockerInstalled = Check-Docker

if (-not $nodeInstalled -or -not $dockerInstalled) {
    Write-Host "Please install missing dependencies before continuing." -ForegroundColor Red
    exit 1
}

Print-Success "All system requirements met"
Write-Host ""

# Part 1: Backend Setup & Installation
Print-Section "PART 1: Backend Setup"

Print-Info "Installing backend dependencies..."
Set-Location Backend
npm install
Print-Success "Backend dependencies installed"

Print-Info "Creating .env file from example..."
if (-not (Test-Path ".env")) {
    Copy-Item "config/.env.example" ".env"
    Print-Success ".env file created (update with your values)"
} else {
    Print-Success ".env file already exists"
}

Set-Location ..

# Part 2: Frontend Setup & Installation
Print-Section "PART 2: Frontend Setup"

Print-Info "Installing frontend dependencies..."
Set-Location frontend
npm install
Print-Success "Frontend dependencies installed"

Print-Info "Creating .env.local file..."
$envContent = @"
# Frontend Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_APP_NAME=Social Media Platform
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_ENABLE_ANALYTICS=false
NEXT_PUBLIC_MAX_FILE_SIZE=10485760
NEXT_PUBLIC_POSTS_PER_PAGE=20
"@

Set-Content -Path ".env.local" -Value $envContent
Print-Success ".env.local file created"

Set-Location ..

# Part 3: Database Setup
Print-Section "PART 3: Database Setup"

Print-Info "Starting MongoDB and Redis with Docker..."
Print-Info "Running: docker-compose up -d"
docker-compose up -d
Print-Success "Services started (MongoDB, Redis, PostgreSQL)"

Start-Sleep -Seconds 5

# Part 4: Instructions for Manual Startup
Print-Section "PART 4: Starting Backend Server"

Print-Info "To start the Node.js backend on port 5000:"
Write-Host "   1. Open a new PowerShell/Command Prompt window" -ForegroundColor White
Write-Host "   2. Navigate to Backend directory: cd Backend" -ForegroundColor White
Write-Host "   3. Start the server: npm run dev" -ForegroundColor White
Write-Host ""
Print-Info "Backend will be available at: http://localhost:5000"
Print-Info "API base URL: http://localhost:5000/api/v1"
Write-Host ""

# Part 5: Frontend Server Instructions
Print-Section "PART 5: Starting Frontend Server"

Print-Info "To start the Next.js frontend on port 3000:"
Write-Host "   1. Open another new PowerShell/Command Prompt window" -ForegroundColor White
Write-Host "   2. Navigate to frontend directory: cd frontend" -ForegroundColor White
Write-Host "   3. Start the server: npm run dev" -ForegroundColor White
Write-Host ""
Print-Info "Frontend will be available at: http://localhost:3000"
Write-Host ""

# Part 6: Verification
Print-Section "PART 6: Verify Installation"

Write-Host ""
Print-Info "After starting both servers, verify the setup:"
Write-Host ""
Write-Host "1. Backend Health Check:" -ForegroundColor White
Write-Host "   curl http://localhost:5000/api/v1/health" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Test Signup:" -ForegroundColor White
Write-Host "   curl -X POST http://localhost:5000/api/v1/auth/signup" -ForegroundColor Gray
Write-Host "   -H 'Content-Type: application/json'" -ForegroundColor Gray
Write-Host "   -d '{...}'" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Open Frontend:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Gray
Write-Host ""

# Part 7: Running Tests
Print-Section "PART 7: Running Tests"

Write-Host ""
Print-Info "To run backend tests:"
Write-Host "   cd Backend && npm test" -ForegroundColor Gray
Write-Host ""
Print-Info "To run backend tests with coverage:"
Write-Host "   cd Backend && npm run test:coverage" -ForegroundColor Gray
Write-Host ""
Print-Info "To run frontend tests:"
Write-Host "   cd frontend && npm test" -ForegroundColor Gray
Write-Host ""

# Part 8: Docker Management
Print-Section "PART 8: Docker Management"

Write-Host ""
Print-Info "View running services:"
Write-Host "   docker-compose ps" -ForegroundColor Gray
Write-Host ""
Print-Info "View service logs:"
Write-Host "   docker-compose logs -f" -ForegroundColor Gray
Write-Host ""
Print-Info "Stop all services:"
Write-Host "   docker-compose down" -ForegroundColor Gray
Write-Host ""
Print-Info "Stop all services and remove volumes:"
Write-Host "   docker-compose down -v" -ForegroundColor Gray
Write-Host ""

# Part 9: Troubleshooting
Print-Section "PART 9: Troubleshooting"

Write-Host ""
Print-Info "Port Already in Use:"
Write-Host "   Use netstat to find process: netstat -ano | findstr :5000" -ForegroundColor Gray
Write-Host "   Kill process: taskkill /PID <PID> /F" -ForegroundColor Gray
Write-Host ""
Print-Info "MongoDB Connection Failed:"
Write-Host "   Check if Docker is running: docker ps" -ForegroundColor Gray
Write-Host "   Check MongoDB URI in .env file" -ForegroundColor Gray
Write-Host ""
Print-Info "CORS Errors:"
Write-Host "   Ensure CORS_ORIGIN in .env matches frontend URL" -ForegroundColor Gray
Write-Host "   Default: http://localhost:3000" -ForegroundColor Gray
Write-Host ""
Print-Info "API Not Found (404):"
Write-Host "   Check NEXT_PUBLIC_API_URL in frontend .env.local" -ForegroundColor Gray
Write-Host "   Verify backend is running on port 5000" -ForegroundColor Gray
Write-Host ""

# Part 10: Quick Commands
Print-Section "PART 10: Quick Reference Commands"

Write-Host ""
Write-Host "Backend Development:" -ForegroundColor Cyan
Write-Host "   cd Backend && npm run dev          # Start development server" -ForegroundColor Gray
Write-Host "   npm test                          # Run tests" -ForegroundColor Gray
Write-Host "   npm run test:watch                # Watch tests" -ForegroundColor Gray
Write-Host "   npm run lint                      # Run linter" -ForegroundColor Gray
Write-Host ""
Write-Host "Frontend Development:" -ForegroundColor Cyan
Write-Host "   cd frontend && npm run dev        # Start development server" -ForegroundColor Gray
Write-Host "   npm run build                     # Build for production" -ForegroundColor Gray
Write-Host "   npm start                        # Start production server" -ForegroundColor Gray
Write-Host ""
Write-Host "Docker Commands:" -ForegroundColor Cyan
Write-Host "   docker-compose up -d              # Start all services" -ForegroundColor Gray
Write-Host "   docker-compose down               # Stop all services" -ForegroundColor Gray
Write-Host "   docker-compose logs -f            # View logs" -ForegroundColor Gray
Write-Host ""

# Part 11: API Documentation
Print-Section "PART 11: Documentation"

Write-Host ""
Print-Info "For complete API documentation, see:"
Write-Host "   Backend/API_DOCUMENTATION.md" -ForegroundColor Gray
Write-Host ""
Print-Info "For frontend-backend integration details, see:"
Write-Host "   FRONTEND_BACKEND_INTEGRATION.md" -ForegroundColor Gray
Write-Host ""
Print-Info "For project setup, see:"
Write-Host "   README.md" -ForegroundColor Gray
Write-Host ""

# Final Message
Print-Section "✅ Setup Complete!"

Write-Host ""
Print-Success "All steps completed successfully!"
Write-Host ""
Print-Info "Next steps:"
Write-Host "1. Open PowerShell/Command Prompt windows for Backend and Frontend" -ForegroundColor White
Write-Host "2. Start Backend:  cd Backend && npm run dev" -ForegroundColor White
Write-Host "3. Start Frontend: cd frontend && npm run dev" -ForegroundColor White
Write-Host "4. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host ""
Print-Info "Services running:"
Write-Host "   MongoDB: localhost:27017" -ForegroundColor Gray
Write-Host "   Redis:   localhost:6379" -ForegroundColor Gray
Write-Host "   Backend: http://localhost:5000" -ForegroundColor Gray
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor Gray
Write-Host ""
