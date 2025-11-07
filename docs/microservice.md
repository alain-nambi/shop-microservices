# Microservice Architecture

## Core Domains

| Service  | Responsibility                          | Data Ownership               |
| -------- | --------------------------------------- | ---------------------------- |
| Products | Product catalog management              | `products`, `categories` |
| Users    | Authentication & user profiles          | `users`, `sessions`      |
| Cart     | Shopping cart state (guest/logged-in)   | Redis Hashes                 |
| Orders   | Order lifecycle & payment orchestration | `orders`, `order_items`  |
| Payments | External payment processing (stubbed)   | `payments`                 |

---

## Communication Patterns

- **REST API**: Synchronous calls between services (e.g., Cart → Products)
- **Redis Pub/Sub**: Async events (e.g., `OrderCreated` → Inventory update)
- **Shared Cache**: Redis for product listings, cart state

---

## Critical Domain Events

1. `UserRegistered` → Send welcome email
2. `ProductUpdated` → Invalidate cache
3. `OrderCreated` → Deduct inventory, notify payment service
4. `PaymentSuccessful` → Update order status

---

## Rules

- No service accesses another service’s database directly.
- All inter-service communication uses HTTP or Redis pub/sub.
- Frontend only calls `/api/*` endpoints via Nginx.
