use actix_web::{web, App, HttpServer};
use actix_cors::Cors;
use crate::model::AppState;

mod model;
mod schema;
mod handlers;
mod auth;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let app_state = AppState::init().await;
    let app_data = web::Data::new(app_state);

    HttpServer::new(move || {
        App::new()
            .wrap(
                Cors::default()
                    .allowed_origin("http://localhost:8000") // Match Traefik frontend URL
                    .allowed_methods(vec!["GET", "POST"])
                    .allowed_headers(vec![
                        actix_web::http::header::CONTENT_TYPE,
                        actix_web::http::header::ACCEPT,
                        actix_web::http::header::AUTHORIZATION,
                    ])
                    .max_age(3600),
            )
            .app_data(app_data.clone())
            .configure(handlers::config)
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
