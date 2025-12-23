#!/bin/bash

echo "Setting up environment files..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Create .env.postgres in root
echo "${BLUE}Creating .env.postgres...${NC}"
cat > .env.postgres << EOF
POSTGRES_PASSWORD=admin123
EOF
echo "${GREEN}Successfully created .env.postgres${NC}"

# Create .env in api directory
echo "${BLUE}Creating api/.env...${NC}"
mkdir -p api
cat > api/.env << EOF
DATABASE_URL="postgresql://markoub_db:admin123@postgres:5432/markoub_db"
DATABASE_DIRECT_URL="postgresql://markoub_db:admin123@localhost:5432/markoub_db"
JWT_SECRET_KEY="8b4e1673049f43c4f1c5e746d9750c66d04ca0566c9455352f1336bbfa825723"
S3_REGION="us-east-1"
S3_ENDPOINT="http://localstack:4566"
S3_ACCESS_KEY_ID="test"
S3_SECRET_ACCESS_KEY="test"
EOF
echo "${GREEN}Successfully created api/.env${NC}"

# Create .env in admin panel directory
mkdir -p "admin panel"
cat > "admin panel/.env" << EOF
VITE_API_URL=http://localhost:8080
EOF

VITE_API_URL=http://localhost:8080
EOF
echo "${GREEN}Successfully created admin/.env${NC}"

# Create localstack-init directory and script
echo "${BLUE}Creating LocalStack initialization script...${NC}"
mkdir -p localstack-init
cat > localstack-init/init-s3.sh << 'EOF'
#!/bin/bash
echo "Initializing LocalStack S3..."
awslocal s3 mb s3://resumes --region us-east-1
echo "S3 bucket 'resumes' created successfully!"
EOF
chmod +x localstack-init/init-s3.sh
echo "${GREEN}Successfully created LocalStack init script${NC}"

echo ""
echo "${GREEN}Environment setup complete${NC}"
echo "${BLUE}Next steps:${NC}"
echo "   1. Run: ${GREEN}docker-compose up --build${NC}"
echo "   2. Your services will be available at:"
echo "      - API: ${GREEN}http://localhost:8080${NC}"
echo "      - Admin Panel: ${GREEN}http://localhost:5173${NC} (if running)"
echo "      - PostgreSQL: ${GREEN}localhost:5432${NC}"
echo "      - LocalStack S3: ${GREEN}http://localhost:4566${NC}"