#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✓ $1${NC}"; }
print_error() { echo -e "${RED}✗ $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠ $1${NC}"; }
print_info() { echo -e "${NC}ℹ $1${NC}"; }

echo "=============================================="
echo "  Ravi Platform - Production Setup"
echo "=============================================="
echo ""

if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed!"
    exit 1
fi
print_success "Docker is installed"

if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed!"
    exit 1
fi
print_success "Docker Compose is installed"

if [ ! -f .env ] || [ ! -f backend/.env.production ] || [ ! -f frontend/.env.production ]; then
    print_error "Environment files not found!"
    exit 1
fi
print_success "Environment files found"

mkdir -p nginx/ssl backend/logs backend/uploads
print_success "Directories created"

print_info "Pulling Docker images..."
docker-compose pull

print_info "Building application images..."
docker-compose build --no-cache

print_info "Starting PostgreSQL..."
docker-compose up -d postgres
sleep 15

print_info "Running database migrations..."
docker-compose run --rm backend npm run migrate:deploy || true

print_info "Starting all services..."
docker-compose up -d

print_info "Checking service health..."
sleep 20

docker-compose ps

echo ""
print_success "Application is running!"
echo ""
echo "Services:"
echo "  - Frontend: http://localhost"
echo "  - Backend API: http://localhost/api"
echo "  - Health Check: http://localhost/api/health"
echo ""
print_warning "IMPORTANT: Configure SSL/TLS certificates for HTTPS!"
print_warning "IMPORTANT: Update ZarinPal merchant ID if using payments!"
echo ""
