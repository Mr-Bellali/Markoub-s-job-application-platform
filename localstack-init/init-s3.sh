#!/bin/bash
echo "Initializing LocalStack S3..."
awslocal s3 mb s3://resumes --region us-east-1
echo "S3 bucket 'resumes' created successfully!"
