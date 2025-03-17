# Stage 1: Build the Rust backend
FROM rust AS backend-builder
WORKDIR /app
COPY ./ib-backend/ /app
RUN cargo build --release

# Stage 2: Build the frontend
FROM node AS frontend-builder
WORKDIR /app
COPY ./inkblink/ /app
RUN yarn install
RUN yarn build

# Stage 3: Combine into one container
FROM node
WORKDIR /app
# Copy the backend binary
COPY --from=backend-builder /app/target/release/ib-backend /app/ib-backend
# Copy backend sql migrations (init.sql)
COPY --from=backend-builder /app/migrations /app/migrations

# Copy the frontend static files
COPY --from=frontend-builder /app/dist /app/inkblink

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
