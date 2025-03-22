use actix_web::{get, post, web, HttpResponse, Responder};
use diesel::prelude::*;
use crate::{
    model::{AppState, CreateIcon, CreateUser, Icon, TransactionType, User},
    schema::{icons, transactions, users},
};
use std::env;
use reqwest::Client;
use serde::Serialize;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Database connection failed: {0}")]
    DbConnection(String),
    #[error("Database operation failed: {0}")]
    DbOperation(#[from] diesel::result::Error),
    #[error("Image generation failed: {0}")]
    ImageGeneration(String),
    #[error("User not found")]
    UserNotFound,
    #[error("Insufficient inkbucks")]
    InsufficientInkbucks,
    #[error("Internal server error: {0}")]
    InternalServerError(String),
}

impl actix_web::ResponseError for AppError {
    fn status_code(&self) -> actix_web::http::StatusCode {
        match self {
            AppError::DbConnection(_) => actix_web::http::StatusCode::INTERNAL_SERVER_ERROR,
            AppError::DbOperation(_) => actix_web::http::StatusCode::INTERNAL_SERVER_ERROR,
            AppError::ImageGeneration(_) => actix_web::http::StatusCode::INTERNAL_SERVER_ERROR,
            AppError::UserNotFound => actix_web::http::StatusCode::BAD_REQUEST,
            AppError::InsufficientInkbucks => actix_web::http::StatusCode::PAYMENT_REQUIRED,
            AppError::InternalServerError(_) => actix_web::http::StatusCode::INTERNAL_SERVER_ERROR,
        }
    }

    fn error_response(&self) -> HttpResponse {
        HttpResponse::build(self.status_code())
            .json(serde_json::json!({"status": "fail", "message": self.to_string()}))
    }
}

#[derive(Serialize)]
struct IconResponse {
    status: String,
    data: IconData,
}

#[derive(Serialize)]
struct IconData {
    icon: FilteredIcon,
}

#[derive(Serialize)]
struct FilteredIcon {
    id: i32,
    user_id: i32,
    icon_pack_id: Option<i32>,
    metadata: Option<String>,
}

#[derive(Serialize)]
struct UserResponse {
    status: String,
    data: UserData,
}

#[derive(Serialize)]
struct UserData {
    user: FilteredUser,
}

#[derive(Serialize)]
struct FilteredUser {
    id: i32,
    email: String,
    username: String,
    inkbucks: i32,
}

fn generate_prompt(name: &str) -> String {
    format!(
        "Generate a minimalist icon for {}. Draw it with simple geometric shapes, flowy like sketched with an ink pen. Bold, simple, and monochrome.",
        name
    )
}

async fn generate_image(prompt: &str) -> Result<Vec<u8>, AppError> {
    let api_key = env::var("STABILITY_API_KEY").unwrap_or_else(|_| {
        "sk-K8H8bsXkAbdnnOZDlZGMjICh1FHG6RNuR52BYjElCV4b8gOs".to_string()
    });
    let url = "https://api.stability.ai/v2beta/stable-image/generate/sd3";

    let client = Client::new();
    let form = reqwest::multipart::Form::new()
        .text("prompt", prompt.to_string())
        .text("output_format", "jpeg");

    let response = client
        .post(url)
        .header("Authorization", format!("Bearer {}", api_key))
        .header("Accept", "image/*")
        .multipart(form)
        .send()
        .await
        .map_err(|e| AppError::ImageGeneration(format!("Request failed: {}", e)))?;

    if response.status().is_success() {
        let image_data = response
            .bytes()
            .await
            .map_err(|e| AppError::ImageGeneration(format!("Failed to read response bytes: {}", e)))?;
        Ok(image_data.to_vec())
    } else {
        Err(AppError::ImageGeneration(format!(
            "Failed to generate image. HTTP Status: {}",
            response.status()
        )))
    }
}

#[post("/icons")]
async fn create_icon(
    data: web::Data<AppState>,
    icon: web::Json<CreateIcon>,
) -> impl Responder {
    let icon = icon.into_inner();
    let prompt = generate_prompt(&icon.metadata.as_ref().unwrap_or(&"default".to_string()));

    let mut conn = match data.db_pool.get() {
        Ok(conn) => conn,
        Err(e) => return HttpResponse::InternalServerError().json(serde_json::json!({
            "status": "fail",
            "message": format!("Failed to get DB connection: {}", e)
        })),
    };

    let icon_id = match conn.transaction(|conn| {
        let inkbucks: i32 = match users::table
            .filter(users::id.eq(icon.user_id))
            .select(users::inkbucks)
            .first(conn) {
            Ok(inkbucks) => inkbucks,
            Err(diesel::result::Error::NotFound) => return Err(AppError::UserNotFound),
            Err(e) => return Err(AppError::DbOperation(e)),
        };

        let transaction_amount = -1;
        if inkbucks + transaction_amount < 0 {
            return Err(AppError::InsufficientInkbucks);
        }

        let new_transaction = (
            transactions::user_id.eq(icon.user_id),
            transactions::type_.eq(match TransactionType::Generate {
                TransactionType::Generate => "generate",
                TransactionType::Style => "style",
                TransactionType::Edit => "edit",
            }),
            transactions::icon_id.eq(0),
            transactions::amount.eq(transaction_amount),
        );

        let transaction_id: i32 = match diesel::insert_into(transactions::table)
            .values(new_transaction)
            .returning(transactions::id)
            .get_result(conn) {
            Ok(id) => id,
            Err(e) => return Err(AppError::DbOperation(e)),
        };

        let new_icon = (
            icons::user_id.eq(icon.user_id),
            icons::icon_pack_id.eq(icon.icon_pack_id),
            icons::metadata.eq(icon.metadata.clone()),
            icons::image_data.eq(Vec::<u8>::new()),
        );

        let icon_id: i32 = match diesel::insert_into(icons::table)
            .values(new_icon)
            .returning(icons::id)
            .get_result(conn) {
            Ok(id) => id,
            Err(e) => return Err(AppError::DbOperation(e)),
        };

        match diesel::update(transactions::table.filter(transactions::id.eq(transaction_id)))
            .set(transactions::icon_id.eq(icon_id))
            .execute(conn) {
            Ok(_) => (),
            Err(e) => return Err(AppError::DbOperation(e)),
        };

        match diesel::update(users::table.filter(users::id.eq(icon.user_id)))
            .set(users::inkbucks.eq(users::inkbucks + transaction_amount))
            .execute(conn) {
            Ok(_) => (),
            Err(e) => return Err(AppError::DbOperation(e)),
        };

        Ok(icon_id)
    }) {
        Ok(id) => id,
        Err(AppError::UserNotFound) => return HttpResponse::BadRequest().json(serde_json::json!({
            "status": "fail",
            "message": "User not found"
        })),
        Err(AppError::InsufficientInkbucks) => return HttpResponse::PaymentRequired().json(serde_json::json!({
            "status": "fail",
            "message": "Insufficient inkbucks"
        })),
        Err(e) => return HttpResponse::InternalServerError().json(serde_json::json!({
            "status": "fail",
            "message": e.to_string()
        })),
    };

    let image_data = match generate_image(&prompt).await {
        Ok(data) => data,
        Err(e) => return HttpResponse::InternalServerError().json(serde_json::json!({
            "status": "fail",
            "message": e.to_string()
        })),
    };

    match diesel::update(icons::table.filter(icons::id.eq(icon_id)))
        .set(icons::image_data.eq(image_data))
        .execute(&mut conn) {
        Ok(_) => (),
        Err(e) => return HttpResponse::InternalServerError().json(serde_json::json!({
            "status": "fail",
            "message": format!("Failed to update icon: {}", e)
        })),
    };

    let inserted_icon: Icon = match icons::table
        .filter(icons::id.eq(icon_id))
        .first(&mut conn) {
        Ok(icon) => icon,
        Err(e) => return HttpResponse::InternalServerError().json(serde_json::json!({
            "status": "fail",
            "message": format!("Failed to retrieve icon: {}", e)
        })),
    };

    let response = IconResponse {
        status: "success".to_string(),
        data: IconData {
            icon: FilteredIcon {
                id: inserted_icon.id,
                user_id: inserted_icon.user_id,
                icon_pack_id: inserted_icon.icon_pack_id,
                metadata: inserted_icon.metadata,
            },
        },
    };

    HttpResponse::Ok().json(response)
}

#[get("/icons/{id}/image")]
async fn get_icon_image(
    data: web::Data<AppState>,
    path: web::Path<i32>,
) -> impl Responder {
    let icon_id = path.into_inner();
    let mut conn = match data.db_pool.get() {
        Ok(conn) => conn,
        Err(e) => return HttpResponse::InternalServerError().json(serde_json::json!({
            "status": "fail",
            "message": format!("Failed to get DB connection: {}", e)
        })),
    };

    let image_data: Option<Vec<u8>> = match icons::table
        .filter(icons::id.eq(icon_id))
        .select(icons::image_data)
        .first(&mut conn)
        .optional() {
        Ok(data) => data,
        Err(e) => return HttpResponse::InternalServerError().json(serde_json::json!({
            "status": "fail",
            "message": format!("Failed to retrieve image: {}", e)
        })),
    };

    match image_data {
        Some(data) => HttpResponse::Ok()
            .content_type("image/jpeg")
            .body(data),
        None => HttpResponse::NotFound().json(serde_json::json!({
            "status": "fail",
            "message": "Image not found"
        })),
    }
}

#[post("/users")]
async fn create_user(
    data: web::Data<AppState>,
    user: web::Json<CreateUser>,
) -> impl Responder {
    let user = user.into_inner();
    let mut conn = match data.db_pool.get() {
        Ok(conn) => conn,
        Err(e) => return HttpResponse::InternalServerError().json(serde_json::json!({
            "status": "fail",
            "message": format!("Failed to get DB connection: {}", e)
        })),
    };

    let new_user = (
        users::email.eq(user.email.clone()),
        users::username.eq(user.username.clone()),
        users::inkbucks.eq(5),
    );

    let user_id: i32 = match diesel::insert_into(users::table)
        .values(new_user)
        .returning(users::id)
        .get_result(&mut conn) {
        Ok(id) => id,
        Err(e) => return HttpResponse::InternalServerError().json(serde_json::json!({
            "status": "fail",
            "message": format!("Failed to insert user: {}", e)
        })),
    };

    let inserted_user: User = match users::table
        .filter(users::id.eq(user_id))
        .first(&mut conn) {
        Ok(user) => user,
        Err(e) => return HttpResponse::InternalServerError().json(serde_json::json!({
            "status": "fail",
            "message": format!("Failed to retrieve user: {}", e)
        })),
    };

    let response = UserResponse {
        status: "success".to_string(),
        data: UserData {
            user: FilteredUser {
                id: inserted_user.id,
                email: inserted_user.email,
                username: inserted_user.username,
                inkbucks: inserted_user.inkbucks,
            },
        },
    };

    HttpResponse::Ok().json(response)
}

pub fn config(conf: &mut web::ServiceConfig) {
    let scope = web::scope("/api")
        .service(create_icon)
        .service(get_icon_image)
        .service(create_user);

    conf.service(scope);
}
