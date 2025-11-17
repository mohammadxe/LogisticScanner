#!/bin/bash
# Quick start script for Freight Rate Optimizer

set -e

echo "=================================================="
echo "Freight Rate Optimizer - Quick Start"
echo "=================================================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://www.docker.com/products/docker-desktop"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed."
    exit 1
fi

echo ""
echo "✅ Docker and Docker Compose are installed"
echo ""

# Show options
echo "Select startup option:"
echo "1) Start full stack (Frontend + Backend + Database)"
echo "2) Start backend only"
echo "3) Start frontend only"
echo "4) View logs"
echo "5) Stop all services"
echo ""

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting full stack..."
        docker-compose up -d
        echo ""
        echo "✅ Services are starting..."
        echo ""
        echo "📍 Frontend:    http://localhost:3000"
        echo "📍 Backend API: http://localhost:8000"
        echo "📍 API Docs:    http://localhost:8000/docs"
        echo "📍 Database:    localhost:5432"
        echo ""
        echo "⏳ Give services 10-15 seconds to start..."
        ;;
    2)
        echo ""
        echo "🚀 Starting backend only..."
        docker-compose up -d backend db
        echo "✅ Backend is starting..."
        echo "📍 Backend API: http://localhost:8000"
        ;;
    3)
        echo ""
        echo "🚀 Starting frontend only..."
        docker-compose up -d frontend
        echo "✅ Frontend is starting..."
        echo "📍 Frontend: http://localhost:3000"
        ;;
    4)
        echo ""
        echo "📋 Showing logs (press Ctrl+C to exit)..."
        docker-compose logs -f
        ;;
    5)
        echo ""
        echo "⛔ Stopping all services..."
        docker-compose down
        echo "✅ All services stopped"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "For more information, see README.md"
