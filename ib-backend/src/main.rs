use actix_web::{web, App, HttpServer};
use actix_cors::Cors;
use sqlx::postgres::PgPoolOptions;

mod models;
mod handlers;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
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
                    // Users
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
                    )
                    // Icon Packs
                    .service(
                        web::resource("/icon_packs")
                            .route(web::post().to(handlers::create_icon_pack))
                            .route(web::get().to(handlers::list_icon_packs)),
                    )
                    .service(
                        web::resource("/icon_packs/{id}")
                            .route(web::get().to(handlers::get_icon_pack))
                            .route(web::put().to(handlers::update_icon_pack))
                            .route(web::delete().to(handlers::delete_icon_pack)),
                    )
                    // Icons
                    .service(
                        web::resource("/icons")
                            .route(web::post().to(handlers::create_icon))
                            .route(web::get().to(handlers::list_icons)),
                    )
                    .service(
                        web::resource("/icons/{id}")
                            .route(web::get().to(handlers::get_icon))
                            .route(web::put().to(handlers::update_icon))
                            .route(web::delete().to(handlers::delete_icon)),
                    )
                    // Transactions
                    .service(
                        web::resource("/transactions")
                            .route(web::post().to(handlers::create_transaction))
                            .route(web::get().to(handlers::list_transactions)),
                    )
                    .service(
                        web::resource("/transactions/{id}")
                            .route(web::get().to(handlers::get_transaction))
                            .route(web::put().to(handlers::update_transaction))
                            .route(web::delete().to(handlers::delete_transaction)),
                    ),
            )
    })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}
