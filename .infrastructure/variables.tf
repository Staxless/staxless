variable "do_token" {
  description = "DigitalOcean API token"
  type        = string
  sensitive   = true
}

variable "ssh_fingerprint" {
  description = "SSH key fingerprint"
  type        = string
}

variable "domain" {
  description = "Domain name"
  type        = string
}

variable "region" {
  description = "DigitalOcean region"
  type        = string
  default     = "nyc3"
}

variable "manager_size" {
  description = "Manager droplet size"
  type        = string
  default     = "s-2vcpu-4gb"
}

variable "worker_size" {
  description = "Worker droplet size"
  type        = string
  default     = "s-2vcpu-4gb"
}

variable "worker_count" {
  description = "Number of worker nodes"
  type        = number
  default     = 2
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.17.0.0/16"
}

variable "authorized_ssh_ips" {
  description = "IPs authorized for SSH"
  type        = list(string)
}

variable "enable_backups" {
  description = "Enable droplet backups"
  type        = bool
  default     = true
}
