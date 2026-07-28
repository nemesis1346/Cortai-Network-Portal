variable "bucket_name" {
  description = "Globally-unique S3 bucket name to hold the built static site (dist/)."
  type        = string
}

variable "aws_region" {
  description = "AWS region for the S3 bucket. CloudFront itself is global."
  type        = string
  default     = "ca-central-1"
}

variable "price_class" {
  description = "CloudFront price class."
  type        = string
  default     = "PriceClass_100" # North America + Europe only, cheapest tier
}

variable "tags" {
  description = "Common resource tags."
  type        = map(string)
  default = {
    Project = "cortai-network-portal"
    Module  = "devices-awaiting-registration"
  }
}