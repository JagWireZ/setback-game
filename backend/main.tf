terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

# Configure the AWS Provider
provider "aws" {
  region = "us-east-1"
  profile = "aws-taylor-app"
}

#
# DynamoDB Table
#
resource "aws_dynamodb_table" "game_state" {
  name         = "setback-gamestate"
  billing_mode = "PAY_PER_REQUEST"

  hash_key = "PK"
  range_key = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }

  tags = {
    App = "Set Back"
  }
}

#
# Zip Lambda code from local folder
#
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambda"
  output_path = "${path.module}/lambda.zip"
}

#
# Lambda Function
#
resource "aws_lambda_function" "setback_backend" {
  function_name = "setback-backend"
  handler       = "index.handler"
  runtime       = "nodejs24.x"

  filename         = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256

  role = aws_iam_role.lambda_exec_role.arn

  environment {
    variables = {
      TABLE_NAME = aws_dynamodb_table.game_state.name
    }
  }
}

#
# IAM Role for Lambda
#
resource "aws_iam_role" "lambda_exec_role" {
  name = "setback-lambda-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

#
# IAM Policy: Lambda can read/write DynamoDB
#
resource "aws_iam_role_policy" "lambda_dynamodb_policy" {
  name = "lambda-dynamodb-access"
  role = aws_iam_role.lambda_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = aws_dynamodb_table.game_state.arn
      }
    ]
  })
}

#
# Allow Lambda to write logs
#
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

#
# Lambda Function URL (public)
#
resource "aws_lambda_function_url" "setback_backend_url" {
  function_name      = aws_lambda_function.setback_backend.function_name
  authorization_type = "NONE"

  cors {
    allow_origins = ["*"]
    allow_methods = ["*"]
  }
}

#
# Output the URL
#
output "lambda_url" {
  value = aws_lambda_function_url.setback_backend_url.function_url
}
