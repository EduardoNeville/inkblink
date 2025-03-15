FROM rust:1.85.0 AS builder
WORKDIR /usr/src/backend
COPY . .
RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /app
COPY --from=builder /usr/src/backend/target/release/ib-backend /app/ib-backend
EXPOSE 8080
CMD ["./ib-backend"]
