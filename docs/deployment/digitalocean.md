```markdown
# Deploying to DigitalOcean

DigitalOcean (DO) is user-friendly for beginners, with Droplets (VMs) for nodes. Let's deploy Staxless to DO for both normal and high availability (HA) setups.

## Node Recommendations
- **Normal**: 1 Droplet ($6/month: 1vCPU, 1GB RAM for light use; upgrade to $24: 2vCPU, 4GB for prod).  
- **HA**: 3 Droplets ($72/month total: each 2vCPU, 4GB). Use VPC for private networking. Scale to 5 ($120+) for 10k+ users.

## Prerequisites
- DO account with SSH key uploaded.  
- Firewall rules: Open ports 80/443 (HTTP/HTTPS), 2377/7946 (Swarm), 22 (SSH).  

## Steps for Normal (Single Droplet)
1. **Create Droplet**: Choose Ubuntu 22.04, add SSH key, enable monitoring.  
2. **SSH In**:  
   ```bash
   ssh root@<droplet-ip>
   ```  
   Install Docker:  
   ```bash
   curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
   apt install docker-compose-plugin
   ```  
3. **Clone Repo**:  
   ```bash
   git clone <repo> && cd staxless
   ```  
   Copy prod env files via SCP:  
   ```bash
   scp local/secrets/prod/*.env root@<ip>:/path/to/staxless/secrets/prod/
   ```  
4. **Deploy**:  
   ```bash
   docker-compose -f config/docker-compose.prod.yml up -d --build
   ```  
5. **Domain/SSL**: Add A record in DO DNS. Install Certbot:  
   ```bash
   apt install certbot python3-certbot-nginx
   certbot --nginx -d yourdomain.com
   ```  

## Steps for HA (Swarm Cluster)
1. **Create Droplets**: Create 3 Droplets, tag as 'manager' and 'workers'. Place in same VPC for private IPs.  
2. **On Manager**: Install Docker as above. Initialize Swarm:  
   ```bash
   docker swarm init --advertise-addr <manager-private-ip>
   ```  
   Get join token:  
   ```bash
   docker swarm join-token worker
   ```  
3. **On Workers**: Run the join command. Promote one worker to manager:  
   ```bash
   docker node promote <worker-hostname>
   ```  
4. **Firewall**: Configure DO Firewall:  
   - Inbound: SSH (22), HTTP/HTTPS (80/443), Swarm ports (2377 TCP manager, 7946 TCP/UDP all, 4789 UDP all).  
5. **Clone/Env**: Clone on manager, sync to workers:  
   ```bash
   rsync -avz /path/to/staxless worker1:/path/
   ```  
6. **Update Compose**: Add replicas in `docker-compose.prod.yml`:  
   ```yaml
   services:
     frontend:
       deploy:
         replicas: 2
         resources:
           limits: { cpus: '0.5', memory: 512M }
     # Add for other services
   volumes:
     mongo_data: { driver: local }
   ```  
7. **Deploy**:  
   ```bash
   docker stack deploy -c config/docker-compose.prod.yml staxless
   ```  
8. **Load Balancer**: Create DO Load Balancer ($10/month): Forward 80/443 to nodes, health check `/health`.  
9. **Scaling**: Add Droplets, join Swarm, scale services:  
   ```bash
   docker service scale staxless_stripe-service=3
   ```  
10. **Monitoring/Backups**: Enable DO Monitoring (free). Use Snapshots ($0.05/GB/month). Auto-backup MongoDB:  
    ```bash
    mongodump --uri=$DATABASE_URI --out=/backup/$(date +%F)
    ```  

## Costs
- Normal: ~$24/month (2vCPU Droplet).  
- HA: ~$100/month ($72 for 3 Droplets, $10 for LB, $5 for VPC).  

## Optimization
Use DO Spaces ($5/month) for media storage instead of local volumes.  

**Pro Tip**: Use DO's 1-Click Docker app for quick nodes. Verify with:  
```bash
doctl compute droplet list
```
```