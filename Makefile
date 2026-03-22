# Makefile for PejicAIX Sovereign

.PHONY: install dev build lint preview clean

# Default target
all: install build

# Install dependencies and initialize substrate
install:
	npm install
	npm run install-substrate

# Start development server
dev:
	npm run dev

# Build for production
build:
	npm run build

# Run linting
lint:
	npm run lint

# Preview production build
preview:
	npm run preview

# Clean build artifacts
clean:
	rm -rf dist
	rm -rf node_modules
