```markdown
# Deploying to AWS

AWS offers robust scaling with ECS (containers) or EKS (Kubernetes). We'll focus on ECS for simplicity. Let's deploy Staxless for both normal and high availability (HA) setups.

## Node Recommendations
- **Normal**: 1 EC2 instance (t3.micro: $0.01/hour ~$7/month for testing; t3.medium: $0.04/hour ~$30 for prod).  
- **HA**: 3 EC2 instances ($90/month: each t3.medium). Use Auto Scaling Group (ASG) for dynamic nodes (min 3, max 6). For high traffic, add more via ASG rules (e.g., CPU >70%).

## Prerequisites
- AWS account, IAM role with ECS/ECR permissions.  
- VPC with 3 public/private subnets across Availability Zones (AZs).  

## Steps for Normal (Single EC2)
1. **Launch EC2**: Amazon Linux 2, security group with inbound: 22 (SSH), 80/443 (HTTP).  
2. **SSH In**: Install Docker and ECS CLI:  
   ```bash
   curl -fsSL https://get.docker.com | sh
   sudo yum install -y amazon-ecs-cli
   ```  
3. **ECR for Images**: Create repository:  
   ```bash
   aws ecr create-repository --repository-name staxless
   ```  
   Build and push:  
   ```bash
   docker build -t <account-id>.dkr.ecr.us-east-1.amazonaws.com/staxless:tag .
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/staxless:tag
   ```  
4. **Clone/Env**: Use SSM Parameter Store for secrets:  
   ```bash
   aws ssm put-parameter --name /staxless/STRIPE_PRIVATE_KEY --value "sk_..." --type SecureString
   ```  
   Fetch in `docker-compose.prod.yml` using AWS SDK.  
5. **Deploy**:  
   ```bash
   docker-compose -f config/docker-compose.prod.yml up -d
   ```  

## Steps for HA (ECS Cluster)
1. **Create VPC/Subnets**: 3 public/private subnets across AZs for redundancy.  
2. **EC2 ASG**: Launch template with Docker installed. ASG: Min 3, max 6 instances, target CPU 50%.  
3. **ECS Cluster**: Create ECS (EC2 type), attach ASG.  
4. **Task Definition**: Convert `docker-compose.prod.yml` to JSON:  
   ```bash
   ecs-cli compose create
   ```  
   Set replicas:  
   ```json
   "deploy": {
     "replicas": 3,
     "placementConstraints": [{"type": "distinctInstance"}]
   }
   ```  
5. **Service**: Create ECS service per microservice with ALB (Application Load Balancer: $0.025/hour ~$18/month). Health checks on `/health`.  
6. **Secrets**: Use Secrets Manager:  
   ```json
   "secrets": [{"name": "STRIPE_PRIVATE_KEY", "valueFrom": "arn:aws:secretsmanager:..."}]
   ```  
7. **Database**: Use Amazon DocumentDB (Mongo-compatible, $0.10/hour ~$70/month for HA with 3 instances). Update `DATABASE_URI`.  
8. **Deploy**:  
   ```bash
   ecs-cli up --cluster staxless