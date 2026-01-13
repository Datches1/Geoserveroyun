# 🚀 FAMOUSGUESSR - Full Stack Deployment Guide

Complete guide to deploy your full-stack Web-GIS game to production.

## 📋 Pre-Deployment Checklist

### 1. MongoDB Atlas Setup
- [x] Create MongoDB Atlas account
- [x] Create database cluster
- [x] Add database user
- [x] Whitelist IP addresses
- [x] Get connection string

### 2. Backend Preparation
- [x] Seed database with celebrities
- [x] Test all API endpoints locally
- [x] Run performance tests with Artillery
- [x] Configure environment variables

### 3. Frontend Preparation
- [x] Update API URL to production endpoint
- [x] Build optimized production bundle
- [x] Test authentication flow
- [x] Verify all routes work

---

## 🔧 Local Development Setup

### Backend Setup

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your MongoDB URI
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/geogame

# Seed database
node seed.js

# Start development server
npm run dev
```

Backend will run on `http://localhost:5000`

### Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## ☁️ AWS Deployment (EC2)

### Option 1: Manual EC2 Deployment

#### Step 1: Launch EC2 Instance

1. Go to AWS Console → EC2
2. Click "Launch Instance"
3. Choose **Ubuntu Server 22.04 LTS**
4. Instance type: **t2.small** or **t2.medium**
5. Configure security group:
   - SSH (22) - Your IP
   - HTTP (80) - Anywhere
   - HTTPS (443) - Anywhere
   - Custom TCP (5000) - Anywhere (for API)
6. Create/select key pair
7. Launch instance

#### Step 2: Connect to EC2

```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

#### Step 3: Install Node.js and Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install Git
sudo apt install -y git

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx
```

#### Step 4: Clone and Setup Backend

```bash
# Create app directory
mkdir ~/geogame
cd ~/geogame

# Clone repository
git clone your-repository-url .

# Setup backend
cd backend
npm install

# Create production .env
cat > .env << EOF
PORT=5000
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_production_key
JWT_EXPIRE=7d
CORS_ORIGIN=http://your-ec2-public-ip
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100
EOF

# Seed database
node seed.js

# Start backend with PM2
pm2 start server.js --name geogame-api
pm2 save
pm2 startup
```

#### Step 5: Setup Frontend

```bash
cd ~/geogame

# Create .env for frontend
cat > .env << EOF
VITE_API_URL=http://your-ec2-public-ip:5000/api
EOF

# Install dependencies
npm install

# Build production bundle
npm run build

# Move build to Nginx directory
sudo rm -rf /var/www/html/*
sudo cp -r dist/* /var/www/html/
```

#### Step 6: Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/geogame
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-ec2-public-ip;

    # Frontend
    location / {
        root /var/www/html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API proxy
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/geogame /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

#### Step 7: Setup SSL (Optional but Recommended)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (requires domain name)
sudo certbot --nginx -d your-domain.com
```

#### Step 8: Verify Deployment

Visit: `http://your-ec2-public-ip`

Test API: `http://your-ec2-public-ip/api/health`

---

### Option 2: AWS Elastic Beanstalk

#### Step 1: Prepare Application

```bash
# Create .ebextensions directory
mkdir .ebextensions

# Create Node.js configuration
cat > .ebextensions/nodecommand.config << EOF
option_settings:
  aws:elasticbeanstalk:container:nodejs:
    NodeCommand: "npm start"
    NodeVersion: 20
EOF
```

#### Step 2: Deploy Backend

```bash
cd backend

# Initialize EB
eb init -p node.js-20 geogame-backend --region us-east-1

# Create environment
eb create geogame-backend-env

# Set environment variables
eb setenv MONGODB_URI=your_mongodb_uri JWT_SECRET=your_secret NODE_ENV=production

# Deploy
eb deploy
```

#### Step 3: Deploy Frontend to S3 + CloudFront

```bash
cd ..
npm run build

# Create S3 bucket
aws s3 mb s3://geogame-frontend

# Upload build
aws s3 sync dist/ s3://geogame-frontend

# Enable static website hosting
aws s3 website s3://geogame-frontend --index-document index.html
```

---

## 🧪 Post-Deployment Testing

### Test API Endpoints

```bash
# Health check
curl http://your-server/api/health

# Get celebrities
curl http://your-server/api/celebrities

# Register user
curl -X POST http://your-server/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123"}'
```

### Run Performance Tests

```bash
cd backend

# Update artillery-config.yml target to production URL
# target: 'http://your-ec2-public-ip:5000'

npm test
```

---

## 📊 Monitoring & Maintenance

### PM2 Commands

```bash
# View logs
pm2 logs geogame-api

# Restart API
pm2 restart geogame-api

# Monitor
pm2 monit

# View status
pm2 status
```

### Nginx Commands

```bash
# Check status
sudo systemctl status nginx

# Restart
sudo systemctl restart nginx

# View logs
sudo tail -f /var/log/nginx/error.log
```

### Database Backup

```bash
# MongoDB Atlas automatic backups are enabled by default
# Manual backup:
mongodump --uri="your_mongodb_uri" --out=backup-$(date +%Y%m%d)
```

---

## 🔒 Security Best Practices

1. **Use environment variables** for all secrets
2. **Enable HTTPS** with SSL certificates
3. **Configure firewall** (UFW on Ubuntu):
   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 443
   sudo ufw enable
   ```
4. **Regular updates**:
   ```bash
   sudo apt update && sudo apt upgrade
   pm2 update
   ```
5. **MongoDB IP Whitelist** only your EC2 IP
6. **Strong JWT secret** (32+ characters)
7. **Rate limiting** enabled (already configured)

---

## 💰 Cost Estimation

### AWS Costs (Monthly)
- EC2 t2.small: ~$17/month
- MongoDB Atlas Free Tier: $0
- Bandwidth: ~$5/month
- **Total: ~$22/month**

### Optimization Tips
- Use AWS Free Tier (12 months free)
- Auto-shutdown during low traffic
- Enable CloudFront caching

---

## 🆘 Troubleshooting

### Backend not starting
```bash
# Check logs
pm2 logs geogame-api

# Check if port is in use
sudo netstat -tulpn | grep 5000

# Restart
pm2 restart geogame-api
```

### Frontend 404 errors
```bash
# Check Nginx config
sudo nginx -t

# Check file permissions
ls -la /var/www/html

# Rebuild frontend
npm run build && sudo cp -r dist/* /var/www/html/
```

### Database connection errors
- Verify MongoDB URI in `.env`
- Check IP whitelist in MongoDB Atlas
- Test connection: `node -e "require('./config/database.js')"`

---

## ✅ Final Checklist

- [ ] MongoDB Atlas configured and seeded
- [ ] Backend API running on EC2/EB
- [ ] Frontend deployed and accessible
- [ ] SSL certificate installed
- [ ] All API endpoints tested
- [ ] Performance tests passed
- [ ] Monitoring setup (PM2)
- [ ] Backups configured
- [ ] Security hardened

**Your FAMOUSGUESSR game is now live! 🎉**

---

## 📚 Additional Resources

- [AWS EC2 Documentation](https://docs.aws.amazon.com/ec2/)
- [MongoDB Atlas Guide](https://docs.atlas.mongodb.com/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [PM2 Documentation](https://pm2.keymetrics.io/)
