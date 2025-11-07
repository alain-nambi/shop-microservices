FROM oven/bun:latest as builder

WORKDIR /app
COPY package*.json ./
RUN bun install

COPY . .

# # Build the application
# RUN bun run build

# WORKDIR /app
# COPY --from=builder /app/dist ./dist
# COPY --from=builder /app/package.json ./

EXPOSE 3000

CMD [ "bun", "run", "dev" ]