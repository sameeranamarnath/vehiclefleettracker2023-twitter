resource "aws_sqs_queue" "sqs_queue" {
  name                       = var.sqs_queue_name
  visibility_timeout_seconds = 50
  max_message_size           = 4096
  message_retention_seconds  = 86400 * 1
  receive_wait_time_seconds  = 5
}
