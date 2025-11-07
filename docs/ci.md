# CI/CD Pipeline

## GitHub Actions Workflow

### On Push to Main

1. Run unit tests
2. Run integration tests
3. Build Docker images
4. Deploy to staging

### On Pull Request

1. Run unit tests only
2. Lint code
3. Validate Dockerfile syntax

---

## Staging Deployment

```bash
docker stack deploy -c docker/swarm/stack.yml shop-staging
```


## Production Deployment

```bash
docker stack deploy -c docker/swarm/stack.yml shop-prod
```