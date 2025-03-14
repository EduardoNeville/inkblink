FROM rust:1.85.0-alpine AS builder
WORKDIR /usr/src/backend
COPY . .
RUN cargo build --release

FROM rust:1.75-slim
WORKDIR /app
COPY --from=builder /usr/src/backend/target/release/backend /app/backend
EXPOSE 8080
CMD ["./ib-backend"]
