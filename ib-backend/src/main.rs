use actix_web::{web, App, HttpServer};
use actix_cors::Cors;
use rusqlite::{params, Connection, Result};
use r2d2_sqlite::SqliteConnectionManager;
use std::env;

mod models;
mod handlers;


#[derive(Debug)]
struct AppState {
    pool: r2d2::Pool<SqliteConnectionManager>,
}

#[derive(Debug)]
enum AppStateError {
    DatabaseError(rusqlite::Error),
    IoError(std::io::Error),
    PoolError(r2d2::Error),
}

async fn database_connection() -> Result<AppState, AppStateError> {
    // You can still use an environment variable if desired
    let database_url = env::var("DATABASE_URL")
        .unwrap_or_else(|_| "data.db".to_string());

    // Create a connection manager for SQLite
    let manager = SqliteConnectionManager::file(&database_url);
    
    // Build the pool (configure max connections as needed)
    let pool = r2d2::Pool::builder()
        .max_size(10) // Adjust based on your scalability needs
        .build(manager)
        .map_err(|e| AppStateError::PoolError(e))?;

    // Get a connection to run migrations (runs once on startup)
    let mut conn = pool.get().map_err(|e| AppStateError::PoolError(e))?;
    let init_sql = std::fs::read_to_string("./migrations/init.sql")
        .map_err(|e| AppStateError::IoError(e))?;
    conn.execute(&init_sql, [])
        .map_err(|e| AppStateError::DatabaseError(e))?;

    Ok(AppState { pool })
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = database_connection().await.map_err(|e| {
        eprintln!("Failed to create database pool: {:?}", e);
        std::io::Error::new(std::io::ErrorKind::Other, "Failed to create database pool")
    })?;

    let app_state = web::Data::new(app_state);

    HttpServer::new(move || {
        App::new()
            .wrap(
                Cors::default()
                    .allowed_origin("http://localhost:5173")
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                    .allowed_headers(vec![
                        actix_web::http::header::AUTHORIZATION,
                        actix_web::http::header::ACCEPT,
                    ])
                    .allowed_header(actix_web::http::header::CONTENT_TYPE)
                    .max_age(3600),
            )
            .app_data(app_state.clone())
            .service(
                web::scope("/api")
                    .service(
                        web::resource("/users")
                            .route(web::post().to(handlers::create_user))
                    )
            )
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
