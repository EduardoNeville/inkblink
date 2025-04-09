# Stage 1: Build the Rust backend
#FROM rust:1.85-bookworm AS backend-builder
#RUN apt-get update && apt-get install -y curl build-essential libpq-dev
#WORKDIR /app
#COPY ./ib-backend/ /app
#RUN cargo build --release

# Stage 2: Build the frontend
FROM node:23-alpine3.20 AS frontend-builder
WORKDIR /app
COPY ./inkblink/ /app
RUN yarn install
RUN yarn build

# Stage 3: Combine into one container
FROM node:23-bookworm
WORKDIR /app
# Install dependencies
RUN apt-get update && apt-get install -y curl build-essential libpq-dev libpq5
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"
RUN cargo install diesel_cli --no-default-features --features postgres
# Copy builds
#COPY --from=backend-builder /app/target/release/ib-backend /app/ib-backend
COPY ./ib-backend/target/release/ib-backend /app/ib-backend
# Copy backend sql migrations (init.sql)
COPY ./ib-backend/migrations /app/migrations
# Copy the frontend static files
COPY --from=frontend-builder /app/dist /app/inkblink
#COPY ./inkblink/dist /app/inkblink
# Copy the startup script
COPY start.sh /app/start.sh
# Make the script executable
RUN chmod +x /app/start.sh
# Install a simple HTTP server for the frontend
RUN yarn global add serve
# Expose ports (backend on 8080, frontend on 3000)
EXPOSE 8080 3000
# Run the startup script
CMD ["/app/start.sh"]
