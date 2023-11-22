variable "aws_vpc_id" {
  type        = string
  description = "AWS VPC ID deployed from network repo"
  default     = "vpc-004cb78e558bde3ed"
}

variable "aws_public_subnet_ids" {
  description = "public subnet ids"
  default     = ["subnet-0e2f0f7a73f5c3dea", "subnet-012eaa330a2fc9cdd"] # CHANGE TO YOUR SUBNET IDS
}


variable "aws_private_subnet_ids" {
  description = "private subnet ids"
  default     = ["subnet-08325656ff40174fd", "subnet-0811ce5fe6efe9151"] # CHANGE TO YOUR SUBNET IDS
}

variable "aws_region" {
  default = "us-east-1" #bugfix
}

variable "app_name" {
  default = "vehiclefleettracker2023"
}
variable "lb_name" {
  default = "vehiclefleettracker2023-lb"
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
  description = " SQS queue"
  default     = "vendor-twitter-queue"
}

variable "image_tag" {}
