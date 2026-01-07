# terraform/variables.tf
variable "region" {
  description = "OCI region"
  type        = string
  default     = "uk-london-1"
}

variable "tenancy_ocid" {
  description = "OCID of your tenancy"
  type        = string
}

variable "user_ocid" {
  description = "OCID of the user"
  type        = string
}

variable "fingerprint" {
  description = "Fingerprint of the API key"
  type        = string
}

variable "private_key_path" {
  description = "Path to the private key file"
  type        = string
}

variable "compartment_ocid" {
  description = "OCID of the compartment"
  type        = string
}

variable "domain_name" {
  description = "Your domain name"
  type        = string
}

variable "bucket_name" {
  description = "Name for the Object Storage bucket"
  type        = string
  default     = "portfolio-website"
}