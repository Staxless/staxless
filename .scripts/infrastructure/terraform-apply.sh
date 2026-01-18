#!/bin/bash
set -e

echo "🚀 Provisioning infrastructure with Terraform..."

cd .infrastructure

# Create backend config
cat > backend.tf << 'BACKENDEOF'
terraform {
  backend "s3" {
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    endpoint                    = "https://nyc3.digitaloceanspaces.com"
    region                      = "us-east-1"
    bucket                      = "staxless-terraform-state"
    key                         = "production/terraform.tfstate"
    access_key                  = "$DO_SPACES_ACCESS_KEY"
    secret_key                  = "$DO_SPACES_SECRET_KEY"
  }
}
BACKENDEOF

# Initialize
terraform init -upgrade

# Validate
terraform validate

# Plan
terraform plan -var-file=production.tfvars -out=tfplan

# Apply
terraform apply -auto-approve tfplan

# Get outputs
MANAGER_IP=$(terraform output -raw manager_ip)
WORKER_IPS=$(terraform output -json worker_ips | jq -r '.[]' | tr '\n' ',')
ALL_NODE_IPS=$(terraform output -json all_node_ips)

# Save to GitHub environment
echo "MANAGER_IP=$MANAGER_IP" >> $GITHUB_ENV
echo "WORKER_IPS=$WORKER_IPS" >> $GITHUB_ENV
echo "ALL_NODE_IPS=$ALL_NODE_IPS" >> $GITHUB_ENV

echo "✅ Infrastructure provisioned"
echo "Manager IP: $MANAGER_IP"
echo "Worker IPs: $WORKER_IPS"
