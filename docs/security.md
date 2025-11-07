# Security & Secrets Management

## Secret Storage

| Environment | Method               |
| ----------- | -------------------- |
| Local Dev   | `.env` file        |
| Production  | Docker Swarm secrets |

## .env Example

```env
POSTGRES_USER=shop
POSTGRES_PASSWORD=securepass123
JWT_SECRET=supersecretkeyforjwt
REDIS_HOST=localhost
REDIS_PORT=6379
```
