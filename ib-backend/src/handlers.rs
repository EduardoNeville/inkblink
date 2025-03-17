//use std::env;
//
use actix_web::{web, HttpResponse, Error};

use crate::{models::*, AppState};

// --- Users Handlers ---
pub async fn create_user(app_state: web::Data<AppState>, user: web::Json<CreateUser>) -> Result<HttpResponse, Error> {
    let mut conn = app_state.pool.get().map_err(|e| {
        actix_web::error::ErrorInternalServerError(format!("Failed to get DB connection: {}", e))
    })?;
    let user = user.into_inner();

    conn.execute(
            "INSERT INTO users (email, username, inkbucks, created_at) VALUES (?1, ?2, 5)",
            [user.email, user.username]
        )
    .map_err(|e| actix_web::error::ErrorInternalServerError(e))?;

    Ok(HttpResponse::Ok().body("User created"))
}

//
//pub async fn get_user(app_state: web::Data<AppState>, path: web::Path<Uuid>) -> HttpResponse {
//    let user_id = path.into_inner();
//    let result = sqlx::query_as!(
//        User,
//        "SELECT id, email, username, inkbucks, created_at FROM users WHERE id = $1",
//        user_id
//    )
//    .fetch_one(&app_state.pool)
//    .await;
//
//    match result {
//        Ok(user) => HttpResponse::Ok().json(user),
//        Err(sqlx::Error::RowNotFound) => HttpResponse::NotFound().body("User not found"),
//        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
//    }
//}
//
//pub async fn update_user(
//    app_state: web::Data<AppState>,
//    path: web::Path<Uuid>,
//    update: web::Json<UpdateUser>,
//) -> HttpResponse {
//    let user_id = path.into_inner();
//    let update = update.into_inner();
//    let result = sqlx::query!(
//        "UPDATE users SET email = COALESCE($1, email), username = COALESCE($2, username), inkbucks = COALESCE($3, inkbucks) WHERE id = $4",
//        update.email,
//        update.username,
//        update.inkbucks,
//        user_id
//    )
//    .execute(&app_state.pool)
//    .await;
//
//    match result {
//        Ok(res) if res.rows_affected() > 0 => HttpResponse::Ok().finish(),
//        Ok(_) => HttpResponse::NotFound().body("User not found"),
//        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
//    }
//}
//
//pub async fn delete_user(app_state: web::Data<AppState>, path: web::Path<Uuid>) -> HttpResponse {
//    let user_id = path.into_inner();
//    let result = sqlx::query!("DELETE FROM users WHERE id = $1", user_id)
//        .execute(&app_state.pool)
//        .await;
//
//    match result {
//        Ok(res) if res.rows_affected() > 0 => HttpResponse::Ok().finish(),
//        Ok(_) => HttpResponse::NotFound().body("User not found"),
//        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
//    }
//}
//
//// --- Icon Packs Handlers ---
//pub async fn create_icon_pack(app_state: web::Data<AppState>, pack: web::Json<CreateIconPack>) -> HttpResponse {
//    let pack = pack.into_inner();
//    let result = sqlx::query_as!(
//        IconPack,
//        "INSERT INTO icon_packs (user_id, name) VALUES ($1, $2) RETURNING id, user_id, name, created_at",
//        pack.user_id,
//        pack.name
//    )
//    .fetch_one(&app_state.pool)
//    .await;
//
//    match result {
//        Ok(pack) => HttpResponse::Ok().json(pack),
//        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
//    }
//}
//
//pub async fn list_icon_packs(app_state: web::Data<AppState>) -> HttpResponse {
//    let result = sqlx::query_as!(
//        IconPack,
//        "SELECT id, user_id, name, created_at FROM icon_packs"
//    )
//    .fetch_all(&app_state.pool)
//    .await;
//
//    match result {
//        Ok(packs) => HttpResponse::Ok().json(packs),
//        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
//    }
//}
//
//pub async fn get_icon_pack(app_state: web::Data<AppState>, path: web::Path<Uuid>) -> HttpResponse {
//    let pack_id = path.into_inner();
//    let result = sqlx::query_as!(
//        IconPack,
//        "SELECT id, user_id, name, created_at FROM icon_packs WHERE id = $1",
//        pack_id
//    )
//    .fetch_one(&app_state.pool)
//    .await;
//
//    match result {
//        Ok(pack) => HttpResponse::Ok().json(pack),
//        Err(sqlx::Error::RowNotFound) => HttpResponse::NotFound().body("Icon pack not found"),
//        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
//    }
//}
//
//pub async fn update_icon_pack(
//    app_state: web::Data<AppState>,
//    path: web::Path<Uuid>,
//    update: web::Json<UpdateIconPack>,
//) -> HttpResponse {
//    let pack_id = path.into_inner();
//    let update = update.into_inner();
//    let result = sqlx::query!(
//        "UPDATE icon_packs SET name = COALESCE($1, name) WHERE id = $2",
//        update.name,
//        pack_id
//    )
//    .execute(&app_state.pool)
//    .await;
//
//    match result {
//        Ok(res) if res.rows_affected() > 0 => HttpResponse::Ok().finish(),
//        Ok(_) => HttpResponse::NotFound().body("Icon pack not found"),
//        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
//    }
//}
//
//pub async fn delete_icon_pack(app_state: web::Data<AppState>, path: web::Path<Uuid>) -> HttpResponse {
//    let pack_id = path.into_inner();
//    let result = sqlx::query!("DELETE FROM icon_packs WHERE id = $1", pack_id)
//        .execute(&app_state.pool)
//        .await;
//
//    match result {
//        Ok(res) if res.rows_affected() > 0 => HttpResponse::Ok().finish(),
//        Ok(_) => HttpResponse::NotFound().body("Icon pack not found"),
//        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
//    }
//}
//
//// --- Icons Handlers ---
//
//pub async fn list_icons(app_state: web::Data<AppState>) -> HttpResponse {
//    let result = sqlx::query_as!(
//        Icon,
//        "SELECT id, user_id, icon_pack_id, image_url, metadata, created_at FROM icons"
//    )
//    .fetch_all(&app_state.pool)
//    .await;
//
//    match result {
//        Ok(icons) => HttpResponse::Ok().json(icons),
//        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
//    }
//}
//
///// Generate a stylized prompt for icons.
//fn generate_prompt(name: &str) -> String {
//    format!("Generate a minimalist icon for {}. Draw it with simple geometric shapes, flowy like sketched with an ink pen. Bold, simple, and monochrome.", name)
//}
//
///// Runs a reqwest HTTP request to generate an image.
//async fn generate_image_via_reqwest(prompt: &str) -> Result<Vec<u8>, String> {
//    let api_key = env::var("STABILITY_API_KEY").unwrap_or_else(|_| "sk-K8H8bsXkAbdnnOZDlZGMjICh1FHG6RNuR52BYjElCV4b8gOs".to_string());
//    let url = "https://api.stability.ai/v2beta/stable-image/generate/sd3";
//    
//    let client = Client::new();
//    let form = reqwest::multipart::Form::new()
//        .text("prompt", prompt.to_string())
//        .text("output_format", "jpeg".to_string());
//
//    let response = client
//        .post(url)
//        .header("Authorization", format!("Bearer {}", api_key))
//        .header("Accept", "image/*")
//        .multipart(form)
//        .send()
//        .await
//        .map_err(|e| format!("Request failed: {}", e))?;
//
//    if response.status().is_success() {
//        let image_data = response.bytes().await.map_err(|e| format!("Failed to read response bytes: {}", e))?;
//        Ok(image_data.to_vec())
//    } else {
//        Err(format!("Failed to generate image. HTTP Status: {}", response.status()))
//    }
//}
//
///// Handler for creating an icon with actual image generation, using `reqwest`.
//pub async fn create_icon(
//    app_state: web::Data<AppState>,
//    icon: web::Json<CreateIcon>,
//) -> HttpResponse {
//    let icon = icon.into_inner();
//    let prompt = generate_prompt(&icon.metadata.unwrap().to_string());
//
//    match generate_image_via_reqwest(&prompt).await {
//        Ok(image_data) => {
//            let result = sqlx::query_as!(
//                Icon,
//                "INSERT INTO icons (user_id, icon_pack_id, image_url, metadata, image_data) 
//                 VALUES ($1, $2, $3, $4, $5) 
//                 RETURNING id, user_id, icon_pack_id, image_url, metadata, image_data, created_at",
//                icon.user_id,
//                icon.icon_pack_id,
//                "stored_in_db", // No external URL, since stored in DB
//                icon.metadata,
//                &image_data
//            )
//            .fetch_one(&app_state.pool)
//            .await;
//
//            match result {
//                Ok(icon) => HttpResponse::Ok().json(icon),
//                Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
//            }
//        }
//        Err(err) => HttpResponse::InternalServerError().body(err),
//    }
//}
//
///// Handler to retrieve an image from the database.
//pub async fn get_icon_image(app_state: web::Data<AppState>, path: web::Path<Uuid>) -> HttpResponse {
//    let icon_id = path.into_inner();
//    match sqlx::query!("SELECT image_data FROM icons WHERE id = $1", icon_id)
//        .fetch_one(&app_state.pool)
//        .await
//    {
//        Ok(record) => match record.image_data {
//            Some(data) => HttpResponse::Ok()
//                .content_type("image/jpeg")
//                .body(data),
//            None => HttpResponse::NotFound().body("Image not found"),
//        },
//        Err(_) => HttpResponse::InternalServerError().body("Error retrieving image"),
//    }
//}
//
//pub async fn delete_icon(app_state: web::Data<AppState>, path: web::Path<Uuid>) -> HttpResponse {
//    let icon_id = path.into_inner();
//    let result = sqlx::query!("DELETE FROM icons WHERE id = $1", icon_id)
//        .execute(&app_state.pool)
//        .await;
//
//    match result {
//        Ok(res) if res.rows_affected() > 0 => HttpResponse::Ok().finish(),
//        Ok(_) => HttpResponse::NotFound().body("Icon not found"),
//        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
//    }
//}
//
//// --- Transactions Handlers ---
//pub async fn create_transaction(app_state: web::Data<AppState>, tx: web::Json<CreateTransaction>) -> HttpResponse {
//    let tx = tx.into_inner();
//    let result = sqlx::query_as!(
//        Transaction,
//        "INSERT INTO transactions (user_id, type, icon_id, amount) VALUES ($1, $2, $3, $4) RETURNING id, user_id, type AS \"type_: TransactionType\", icon_id, amount, created_at",
//        tx.user_id,
//        tx.type_ as TransactionType,
//        tx.icon_id,
//        tx.amount
//    )
//    .fetch_one(&app_state.pool)
//    .await;
//
//    match result {
//        Ok(tx) => HttpResponse::Ok().json(tx),
//        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
//    }
//}
//
//pub async fn list_transactions(app_state: web::Data<AppState>) -> HttpResponse {
//    let result = sqlx::query_as!(
//        Transaction,
//        "SELECT id, user_id, type AS \"type_: TransactionType\", icon_id, amount, created_at FROM transactions"
//    )
//    .fetch_all(&app_state.pool)
//    .await;
//
//    match result {
//        Ok(txs) => HttpResponse::Ok().json(txs),
//        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
//    }
//}
//
//pub async fn get_transaction(app_state: web::Data<AppState>, path: web::Path<Uuid>) -> HttpResponse {
//    let tx_id = path.into_inner();
//    let result = sqlx::query_as!(
//        Transaction,
//        "SELECT id, user_id, type AS \"type_: TransactionType\", icon_id, amount, created_at FROM transactions WHERE id = $1",
//        tx_id
//    )
//    .fetch_one(&app_state.pool)
//    .await;
//
//    match result {
//        Ok(tx) => HttpResponse::Ok().json(tx),
//        Err(sqlx::Error::RowNotFound) => HttpResponse::NotFound().body("Transaction not found"),
//        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
//    }
//}
//
//// Note: Update and Delete for transactions might not be needed if they are immutable, but included for completeness
//pub async fn update_transaction(
//    pool: web::Data<PgPool>,
//    path: web::Path<Uuid>,
//    _update: web::Json<()> // Placeholder; transactions typically don't update
//) -> HttpResponse {
//    HttpResponse::MethodNotAllowed().body("Transactions are immutable and cannot be updated")
//}
//
//pub async fn delete_transaction(app_state: web::Data<AppState>, path: web::Path<Uuid>) -> HttpResponse {
//    let tx_id = path.into_inner();
//    let result = sqlx::query!("DELETE FROM transactions WHERE id = $1", tx_id)
//        .execute(&app_state.pool)
//        .await;
//
//    match result {
//        Ok(res) if res.rows_affected() > 0 => HttpResponse::Ok().finish(),
//        Ok(_) => HttpResponse::NotFound().body("Transaction not found"),
//        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
//    }
//}
