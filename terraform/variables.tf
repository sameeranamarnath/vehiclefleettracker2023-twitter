variable "aws_vpc_id" {
  type        = string
  description = "AWS VPC ID deployed from network repo"
  default     = "vpc-0ea61ea098cf5f747"
}

variable "aws_public_subnet_ids" {
  description = "public subnet ids"
  default     = ["subnet-0c7a3fd95e72dc68b", "subnet-06074be1d5b4f7c22"] # CHANGE TO YOUR SUBNET IDS
}


variable "aws_private_subnet_ids" {
  description = "private subnet ids"
  default     = ["subnet-0e83578144e584857", "subnet-0f9028bcdc2796e4c"] # CHANGE TO YOUR SUBNET IDS
}

variable "aws_region" {
  default = "us-east-1" #bugfix
}

variable "app_name" {
  default = "vehiclefleettracker2023-networkconfig"
}

variable "ecs_twitter_env_secrets_key" {
  description = "Secrets key file"
  default     = "ecs_env_vars.json"
}

variable "ecs_twitter_env_secrets_folder" {
  description = "Secrets S3 folder"
  default     = "vehiclefleet2023-twitter-secrets"
}

variable "dynamodb_vendor_table_name" {
  description = "Table name for dynamodb vendors"
  default     = "vendors"
}

variable "sqs_queue_name" {
  description = "Name for SQS queue"
  default     = "vendor-twitter-queue"
}

variable "image_tag" {}
