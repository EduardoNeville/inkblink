use actix_web::{web, App, HttpServer, HttpResponse};
use actix_cors::Cors;
use sqlx::postgres::PgPoolOptions;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // Create database pool
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgres://myuser:mypassword@localhost:5432/mydb")
        .await
        .map_err(|e| std::io::Error::new(std::io::ErrorKind::Other, e))?;

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

mod handlers {
    use actix_web::{web, HttpResponse};
    use sqlx::PgPool;
    
    pub async fn create_user(pool: web::Data<PgPool>) -> HttpResponse {
        // Add actual implementation
        HttpResponse::Ok().finish()
    }
    
    pub async fn list_users(pool: web::Data<PgPool>) -> HttpResponse {
        // Add actual implementation
        HttpResponse::Ok().finish()
    }
    
    pub async fn get_user(
        pool: web::Data<PgPool>,
        path: web::Path<i32>,
    ) -> HttpResponse {
        // Add actual implementation
        HttpResponse::Ok().finish()
    }
    
    pub async fn update_user(
        pool: web::Data<PgPool>,
        path: web::Path<i32>,
    ) -> HttpResponse {
        // Add actual implementation
        HttpResponse::Ok().finish()
    }
    
    pub async fn delete_user(
        pool: web::Data<PgPool>,
        path: web::Path<i32>,
    ) -> HttpResponse {
        // Add actual implementation
        HttpResponse::Ok().finish()
    }
}
