#!/bin/bash
set -e

echo "💥 Destroying DigitalOcean infrastructure..."

cd .infrastructure

terraform init

echo "Resources to be destroyed:"
terraform show

echo "Starting destruction in 10 seconds..."
sleep 10

# Destroy droplets
terraform destroy \
  -target=digitalocean_droplet.manager \
  -target=digitalocean_droplet.workers \
  -auto-approve \
  -var-file=production.tfvars

# Destroy VPC
terraform destroy \
  -target=digitalocean_vpc.main \
  -auto-approve \
  -var-file=production.tfvars

# Destroy firewall
terraform destroy \
  -target=digitalocean_firewall.main \
  -auto-approve \
  -var-file=production.tfvars

echo "✅ Infrastructure destroyed"
echo "⚠️  MongoDB Atlas NOT destroyed"
echo "Delete manually: https://cloud.mongodb.com"
