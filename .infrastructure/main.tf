terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = "~> 2.0"
    }
  }
  backend "s3" {
    skip_credentials_validation = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    endpoint                    = "https://nyc3.digitaloceanspaces.com"
    region                      = "us-east-1"
    bucket                      = "staxless-terraform-state"
    key                         = "production/terraform.tfstate"
  }
}

provider "digitalocean" {
  token = var.do_token
}

resource "digitalocean_vpc" "main" {
  name     = "staxless-vpc"
  region   = var.region
  ip_range = var.vpc_cidr
}

resource "digitalocean_droplet" "manager" {
  name      = "staxless-manager"
  region    = var.region
  size      = var.manager_size
  image     = "ubuntu-24-04-x64"
  vpc_uuid  = digitalocean_vpc.main.id
  ssh_keys  = [var.ssh_fingerprint]
  user_data = file("${path.module}/cloud-init-manager.yml")
  backups   = var.enable_backups
  tags      = ["staxless", "manager"]
}

resource "digitalocean_droplet" "workers" {
  count     = var.worker_count
  name      = "staxless-worker-${count.index + 1}"
  region    = var.region
  size      = var.worker_size
  image     = "ubuntu-24-04-x64"
  vpc_uuid  = digitalocean_vpc.main.id
  ssh_keys  = [var.ssh_fingerprint]
  user_data = file("${path.module}/cloud-init-worker.yml")
  backups   = var.enable_backups
  tags      = ["staxless", "worker"]
}

resource "digitalocean_firewall" "main" {
  name = "staxless-firewall"
  droplet_ids = concat(
    [digitalocean_droplet.manager.id],
    digitalocean_droplet.workers[*].id
  )

  inbound_rule {
    protocol         = "tcp"
    port_range       = "22"
    source_addresses = var.authorized_ssh_ips
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "80"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol         = "tcp"
    port_range       = "443"
    source_addresses = ["0.0.0.0/0", "::/0"]
  }

  inbound_rule {
    protocol    = "tcp"
    port_range  = "2377"
    source_tags = ["staxless"]
  }

  inbound_rule {
    protocol    = "tcp"
    port_range  = "7946"
    source_tags = ["staxless"]
  }

  inbound_rule {
    protocol    = "udp"
    port_range  = "7946"
    source_tags = ["staxless"]
  }

  inbound_rule {
    protocol    = "udp"
    port_range  = "4789"
    source_tags = ["staxless"]
  }

  outbound_rule {
    protocol              = "tcp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "udp"
    port_range            = "1-65535"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }

  outbound_rule {
    protocol              = "icmp"
    destination_addresses = ["0.0.0.0/0", "::/0"]
  }
}
