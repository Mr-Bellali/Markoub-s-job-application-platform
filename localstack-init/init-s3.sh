#!/bin/bash

echo "Waiting for LocalStack to be ready..."
until curl -s http://localhost:4566/_localstack/health | grep -q '"s3": "available"'; do
  sleep 2
done

echo "LocalStack is ready. Creating S3 bucket..."

# Create the resumes bucket
awslocal s3 mb s3://resumes --region us-east-1

# Verify bucket was created
awslocal s3 ls

echo "S3 bucket 'resumes' created successfully!"