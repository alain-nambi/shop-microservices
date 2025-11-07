# 1. Copy .env.example to .env (for local dev)
cp .env.example .env

# 2. Start services
cd docker
docker compose -f dev-compose.yml up --build -d

# 3. Verify all services are running
docker compose -f dev-compose.yml ps

# Expected output:
#         Name                       Command               State           Ports         
# -----------------------------------------------------------------------------------
# shop-nginx             /docker-entrypoint.sh ngin ...   Up      0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
# shop-postgres          docker-entrypoint.sh postgres    Up      0.0.0.0:5432->5432/tcp
# shop-redis             docker-entrypoint.sh redis-s ... Up      0.0.0.0:6379->6379/tcp