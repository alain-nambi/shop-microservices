# Testing Strategy

## Test Layers

| Layer       | Tools                      | Coverage Goal        |
| ----------- | -------------------------- | -------------------- |
| Unit Tests  | Vitest                     | Business logic (90%) |
| Integration | Supertest + Testcontainers | API + DB (70%)       |
| E2E         | Cypress                    | User journeys (100%) |

---

## Test Files Structure
backend/products/
├── src/
│   ├── handlers/
│   └── models/
└── tests/
    ├── unit/
    └── integration/ 

frontend/
├── src/
└── cypress/
    └── e2e/ 



---

## CI Pipeline (GitHub Actions)

```yaml
on: [push]
jobs:
  test:
    steps:
      - name: Run unit tests
        run: bun test --run
      - name: Run integration tests
        run: bun test --integration