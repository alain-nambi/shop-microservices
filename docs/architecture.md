# Infrastructure Architecture

## Network Diagram

[Client] 
   ↓ HTTPS
[Nginx Reverse Proxy] 
   ↓ (routes by path)
[Docker Swarm Cluster]
   ├─ [Products Service] → Postgres (products_db)
   ├─ [Users Service]    → Postgres (users_db)
   ├─ [Cart Service]     → Redis (cache + session)
   └─ [Orders Service]   → Postgres (orders_db) + Redis (events)



---

## Docker Networks

| Network Name     | Purpose                           | Services Included               |
|------------------|-----------------------------------|---------------------------------|
| `frontend-net`   | Nginx + React frontend            | Nginx, React app                |
| `backend-net`    | Microservices                     | Products, Users, Cart, Orders   |
| `db-net`         | Databases (Postgres/Redis)        | Postgres, Redis                 |

---

## Secrets Management

- **Local Dev**: `.env` file (never committed)
- **Production**: Docker Swarm secrets
- **Never hardcode** passwords in code or configs