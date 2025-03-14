use actix_web::{web, App, HttpServer};
use actix_cors::Cors;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Assume pool is your database connection pool (e.g., deadpool_postgres or sqlx)
    let pool = // ... your database pool setup ...

    HttpServer::new(move || {
        App::new()
            .wrap(
                Cors::default()
                    .allowed_origin("http://localhost:5173")
                    .allowed_methods(vec!["GET", "POST", "PUT", "DELETE"])
                    .allowed_headers(vec![http::header::AUTHORIZATION, http::header::ACCEPT])
                    .allowed_header(http::header::CONTENT_TYPE)
                    .max_age(3600),
            )
            .app_data(web::Data::new(pool.clone()))
            .service(
                web::scope("/api")
                    .service(
                        web::resource("/users")
                            .route(web::post().to(handlers::create_user))
                            .route(web::get().to(handlers::list_users)),
                    )
                    .service(
                        web::resource("/users/{id}")
                            .route(web::get().to(handlers::get_user))
                            .route(web::put().to(handlers::update_user))
                            .route(web::delete().to(handlers::delete_user)),
                    ),
            )
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}

// Placeholder for your handlers module
mod handlers {
    use actix_web::{web, HttpResponse};
    pub async fn create_user() -> HttpResponse { HttpResponse::Ok().finish() }
    pub async fn list_users() -> HttpResponse { HttpResponse::Ok().finish() }
    pub async fn get_user() -> HttpResponse { HttpResponse::Ok().finish() }
    pub async fn update_user() -> HttpResponse { HttpResponse::Ok().finish() }
    pub async fn delete_user() -> HttpResponse { HttpResponse::Ok().finish() }
}
