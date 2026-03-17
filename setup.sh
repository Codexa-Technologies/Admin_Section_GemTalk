#!/bin/bash

# GemTalk Setup Script
# This script automates the initial setup of the GemTalk Admin Panel

echo "════════════════════════════════════════════"
echo "    GemTalk Admin Panel - Setup Script"
echo "════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 14+ from https://nodejs.org/"
    exit 1
else
    print_success "Node.js installed: $(node -v)"
fi

if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm."
    exit 1
else
    print_success "npm installed: $(npm -v)"
fi

# Check MongoDB
echo ""
echo "Checking MongoDB..."
if command -v mongod &> /dev/null || command -v mongosh &> /dev/null; then
    print_success "MongoDB installed"
else
    print_warning "MongoDB not found. You can install it from https://www.mongodb.com/try/download/community"
    read -p "Continue without local MongoDB? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Setup Backend
echo ""
echo "════════════════════════════════════════════"
echo "Setting up Backend..."
echo "════════════════════════════════════════════"

cd server

if [ ! -f .env ]; then
    print_warning "Creating .env file from .env.example..."
    cp .env.example .env
    print_success ".env file created"
else
    print_warning ".env file already exists (skipping)"
fi

echo "Installing backend dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Backend dependencies installed"
else
    print_error "Failed to install backend dependencies"
    exit 1
fi

cd ..

# Setup Frontend
echo ""
echo "════════════════════════════════════════════"
echo "Setting up Frontend..."
echo "════════════════════════════════════════════"

cd client

echo "Installing frontend dependencies..."
npm install

if [ $? -eq 0 ]; then
    print_success "Frontend dependencies installed"
else
    print_error "Failed to install frontend dependencies"
    exit 1
fi

cd ..

# Display next steps
echo ""
echo "════════════════════════════════════════════"
echo "✓ Setup Complete!"
echo "════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo ""
echo "1. Create MongoDB admin user:"
echo "   Open MongoDB shell and run:"
echo "   db.admins.insertOne({"
echo "     email: 'admin@gemtalk.com',"
echo "     password: '\$2a\$10\$kPKx9uX.2AXm.P5NfBmVyeNHxKN9SJdLR7W8p1kJx8u6w8O9l4zay',"
echo "     name: 'Admin User',"
echo "     createdAt: new Date(),"
echo "     updatedAt: new Date()"
echo "   })"
echo ""
echo "2. Start MongoDB (if using local):"
echo "   mongod"
echo ""
echo "3. Start the backend (Terminal 1):"
echo "   cd server"
echo "   npm run dev"
echo ""
echo "4. Start the frontend (Terminal 2):"
echo "   cd client"
echo "   npm start"
echo ""
echo "5. Login at http://localhost:3000"
echo "   Email: admin@gemtalk.com"
echo "   Password: password123"
echo ""
echo "📖 For detailed setup, see SETUP.md"
echo "📚 For API docs, see API_DOCUMENTATION.md"
echo ""
