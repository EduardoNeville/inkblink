use actix_web::{web, HttpResponse};
use sqlx::PgPool;
use crate::models::*;

// --- Users Handlers ---
pub async fn create_user(pool: web::Data<PgPool>, user: web::Json<CreateUser>) -> HttpResponse {
    let user = user.into_inner();
    let result = sqlx::query_as!(
        User,
        "INSERT INTO users (email, username) VALUES ($1, $2) RETURNING id, email, username, inkbucks, created_at",
        user.email,
        user.username
    )
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn list_users(pool: web::Data<PgPool>) -> HttpResponse {
    let result = sqlx::query_as!(
        User,
        "SELECT id, email, username, inkbucks, created_at FROM users"
    )
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(users) => HttpResponse::Ok().json(users),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn get_user(pool: web::Data<PgPool>, path: web::Path<Uuid>) -> HttpResponse {
    let user_id = path.into_inner();
    let result = sqlx::query_as!(
        User,
        "SELECT id, email, username, inkbucks, created_at FROM users WHERE id = $1",
        user_id
    )
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(sqlx::Error::RowNotFound) => HttpResponse::NotFound().body("User not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn update_user(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    update: web::Json<UpdateUser>,
) -> HttpResponse {
    let user_id = path.into_inner();
    let update = update.into_inner();
    let result = sqlx::query!(
        "UPDATE users SET email = COALESCE($1, email), username = COALESCE($2, username), inkbucks = COALESCE($3, inkbucks) WHERE id = $4",
        update.email,
        update.username,
        update.inkbucks,
        user_id
    )
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(res) if res.rows_affected() > 0 => HttpResponse::Ok().finish(),
        Ok(_) => HttpResponse::NotFound().body("User not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn delete_user(pool: web::Data<PgPool>, path: web::Path<Uuid>) -> HttpResponse {
    let user_id = path.into_inner();
    let result = sqlx::query!("DELETE FROM users WHERE id = $1", user_id)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(res) if res.rows_affected() > 0 => HttpResponse::Ok().finish(),
        Ok(_) => HttpResponse::NotFound().body("User not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

// --- Icon Packs Handlers ---
pub async fn create_icon_pack(pool: web::Data<PgPool>, pack: web::Json<CreateIconPack>) -> HttpResponse {
    let pack = pack.into_inner();
    let result = sqlx::query_as!(
        IconPack,
        "INSERT INTO icon_packs (user_id, name) VALUES ($1, $2) RETURNING id, user_id, name, created_at",
        pack.user_id,
        pack.name
    )
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(pack) => HttpResponse::Ok().json(pack),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn list_icon_packs(pool: web::Data<PgPool>) -> HttpResponse {
    let result = sqlx::query_as!(
        IconPack,
        "SELECT id, user_id, name, created_at FROM icon_packs"
    )
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(packs) => HttpResponse::Ok().json(packs),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn get_icon_pack(pool: web::Data<PgPool>, path: web::Path<Uuid>) -> HttpResponse {
    let pack_id = path.into_inner();
    let result = sqlx::query_as!(
        IconPack,
        "SELECT id, user_id, name, created_at FROM icon_packs WHERE id = $1",
        pack_id
    )
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(pack) => HttpResponse::Ok().json(pack),
        Err(sqlx::Error::RowNotFound) => HttpResponse::NotFound().body("Icon pack not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn update_icon_pack(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    update: web::Json<UpdateIconPack>,
) -> HttpResponse {
    let pack_id = path.into_inner();
    let update = update.into_inner();
    let result = sqlx::query!(
        "UPDATE icon_packs SET name = COALESCE($1, name) WHERE id = $2",
        update.name,
        pack_id
    )
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(res) if res.rows_affected() > 0 => HttpResponse::Ok().finish(),
        Ok(_) => HttpResponse::NotFound().body("Icon pack not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn delete_icon_pack(pool: web::Data<PgPool>, path: web::Path<Uuid>) -> HttpResponse {
    let pack_id = path.into_inner();
    let result = sqlx::query!("DELETE FROM icon_packs WHERE id = $1", pack_id)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(res) if res.rows_affected() > 0 => HttpResponse::Ok().finish(),
        Ok(_) => HttpResponse::NotFound().body("Icon pack not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

// --- Icons Handlers ---
pub async fn create_icon(pool: web::Data<PgPool>, icon: web::Json<CreateIcon>) -> HttpResponse {
    let icon = icon.into_inner();
    let result = sqlx::query_as!(
        Icon,
        "INSERT INTO icons (user_id, icon_pack_id, image_url, metadata) VALUES ($1, $2, $3, $4) RETURNING id, user_id, icon_pack_id, image_url, metadata, created_at",
        icon.user_id,
        icon.icon_pack_id,
        icon.image_url,
        icon.metadata
    )
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(icon) => HttpResponse::Ok().json(icon),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn list_icons(pool: web::Data<PgPool>) -> HttpResponse {
    let result = sqlx::query_as!(
        Icon,
        "SELECT id, user_id, icon_pack_id, image_url, metadata, created_at FROM icons"
    )
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(icons) => HttpResponse::Ok().json(icons),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn get_icon(pool: web::Data<PgPool>, path: web::Path<Uuid>) -> HttpResponse {
    let icon_id = path.into_inner();
    let result = sqlx::query_as!(
        Icon,
        "SELECT id, user_id, icon_pack_id, image_url, metadata, created_at FROM icons WHERE id = $1",
        icon_id
    )
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(icon) => HttpResponse::Ok().json(icon),
        Err(sqlx::Error::RowNotFound) => HttpResponse::NotFound().body("Icon not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn update_icon(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    update: web::Json<UpdateIcon>,
) -> HttpResponse {
    let icon_id = path.into_inner();
    let update = update.into_inner();
    let result = sqlx::query!(
        "UPDATE icons SET image_url = COALESCE($1, image_url), metadata = COALESCE($2, metadata) WHERE id = $3",
        update.image_url,
        update.metadata,
        icon_id
    )
    .execute(pool.get_ref())
    .await;

    match result {
        Ok(res) if res.rows_affected() > 0 => HttpResponse::Ok().finish(),
        Ok(_) => HttpResponse::NotFound().body("Icon not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn delete_icon(pool: web::Data<PgPool>, path: web::Path<Uuid>) -> HttpResponse {
    let icon_id = path.into_inner();
    let result = sqlx::query!("DELETE FROM icons WHERE id = $1", icon_id)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(res) if res.rows_affected() > 0 => HttpResponse::Ok().finish(),
        Ok(_) => HttpResponse::NotFound().body("Icon not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

// --- Transactions Handlers ---
pub async fn create_transaction(pool: web::Data<PgPool>, tx: web::Json<CreateTransaction>) -> HttpResponse {
    let tx = tx.into_inner();
    let result = sqlx::query_as!(
        Transaction,
        "INSERT INTO transactions (user_id, type, icon_id, amount) VALUES ($1, $2, $3, $4) RETURNING id, user_id, type AS \"type_: TransactionType\", icon_id, amount, created_at",
        tx.user_id,
        tx.type_ as TransactionType,
        tx.icon_id,
        tx.amount
    )
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(tx) => HttpResponse::Ok().json(tx),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn list_transactions(pool: web::Data<PgPool>) -> HttpResponse {
    let result = sqlx::query_as!(
        Transaction,
        "SELECT id, user_id, type AS \"type_: TransactionType\", icon_id, amount, created_at FROM transactions"
    )
    .fetch_all(pool.get_ref())
    .await;

    match result {
        Ok(txs) => HttpResponse::Ok().json(txs),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

pub async fn get_transaction(pool: web::Data<PgPool>, path: web::Path<Uuid>) -> HttpResponse {
    let tx_id = path.into_inner();
    let result = sqlx::query_as!(
        Transaction,
        "SELECT id, user_id, type AS \"type_: TransactionType\", icon_id, amount, created_at FROM transactions WHERE id = $1",
        tx_id
    )
    .fetch_one(pool.get_ref())
    .await;

    match result {
        Ok(tx) => HttpResponse::Ok().json(tx),
        Err(sqlx::Error::RowNotFound) => HttpResponse::NotFound().body("Transaction not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}

// Note: Update and Delete for transactions might not be needed if they are immutable, but included for completeness
pub async fn update_transaction(
    pool: web::Data<PgPool>,
    path: web::Path<Uuid>,
    _update: web::Json<()> // Placeholder; transactions typically don't update
) -> HttpResponse {
    HttpResponse::MethodNotAllowed().body("Transactions are immutable and cannot be updated")
}

pub async fn delete_transaction(pool: web::Data<PgPool>, path: web::Path<Uuid>) -> HttpResponse {
    let tx_id = path.into_inner();
    let result = sqlx::query!("DELETE FROM transactions WHERE id = $1", tx_id)
        .execute(pool.get_ref())
        .await;

    match result {
        Ok(res) if res.rows_affected() > 0 => HttpResponse::Ok().finish(),
        Ok(_) => HttpResponse::NotFound().body("Transaction not found"),
        Err(e) => HttpResponse::InternalServerError().body(e.to_string()),
    }
}
