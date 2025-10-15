```markdown
# Docker Swarm Deployment

Docker Swarm turns multiple machines into a cluster for high availability (HA). It's built-in to Docker and great for self-managed setups. Let's walk through deploying Staxless with Swarm for both normal and HA setups.

## Node Recommendations
- **Normal**: 1 node (e.g., 2vCPU, 4GB RAM, 50GB SSD).  
- **HA**: 3 nodes minimum (1 manager, 2 workers) for quorum. Manager handles orchestration; workers run containers. For higher load, add workers (e.g., 5 total: 3 managers for failover, 2 workers). Each node: Ubuntu 22.04, 4vCPU, 8GB RAM, 50GB SSD.

## Prerequisites
- SSH access between nodes.  
- Docker 20+ installed on all nodes (`curl -fsSL https://get.docker.com | sh`).  

## Steps for Normal (Single Node)
1. Initialize Swarm (even for single node):  
   ```bash
   docker swarm init --advertise-addr <node-ip>
   ```  
2. Deploy the stack:  
   ```bash
   docker stack deploy -c config/docker-compose.prod.yml staxless
   ```  
3. Verify: Check services are running:  
   ```bash
   docker stack ps staxless
   ```  
   All services should show as "Running".  

## Steps for HA (Multi-Node)
1. **On Manager Node**: Initialize Swarm:  
   ```bash
   docker swarm init --advertise-addr <manager-ip>
   ```  
   Copy the join command (e.g., `docker swarm join --token <token> <manager-ip>:2377`).  

2. **On Worker Nodes**: Run the join command to add each worker to the Swarm. Promote one worker to manager for redundancy:  
   ```bash
   docker node promote <worker-id>
   ```  

3. **Update Compose File**: Modify `docker-compose.prod.yml` to include replicas for HA:  
   ```yaml
   services:
     frontend:
       deploy:
         replicas: 2  # Scale as needed
         resources:
           limits: { cpus: '0.5', memory: 512M }
     kong-api-gateway:
       deploy:
         replicas: 1  # Stateless, but add more for load
     # Repeat for auth, user, etc. Kafka/Zookeeper: replicas 3 for HA
   ```  

4. **Deploy Stack**: From the manager node:  
   ```bash
   docker stack deploy -c config/docker-compose.prod.yml staxless
   ```  

5. **Load Balancing**: Use an external balancer (e.g., Nginx) or Swarm's built-in ingress. Expose ports on all nodes (80/443 for HTTP/HTTPS).  

6. **Scaling**: Adjust replicas dynamically:  
   ```bash
   docker service scale staxless_frontend=3
   ```  
   Update the stack for config changes: `docker stack deploy -c config/docker-compose.prod.yml staxless`.  

7. **Monitoring**: Check logs:  
   ```bash
   docker service logs staxless_kong-api-gateway
   ```  
   Add Prometheus for metrics: Install on manager, configure in `kong.yaml` with `prometheus` plugin.  

8. **Backup/Restore**: Back up volumes:  
   ```bash
   docker volume ls
   rsync -av /var/lib/docker/volumes /backup/
   ```  
   For MongoDB, use:  
   ```bash
   mongodump --uri=$DATABASE_URI --out=/backup/$(date +%F)
   ```  

## Security
Use Docker secrets for sensitive env vars in `docker-compose.prod.yml`:  
```yaml
services:
  stripe-service:
    secrets:
      - stripe_key
secrets:
  stripe_key:
    file: ./secrets/stripe_key.txt
```  

## Costs
Approximately $15/node on VPS providers. For HA with 3 nodes: ~$45/month.  

**Pro Tip**: Test failover by stopping a worker:  
```bash
docker node demote <id>
docker node rm <id>
```  
Rejoin nodes as needed with the join command.
```