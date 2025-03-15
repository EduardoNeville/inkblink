use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

// Transaction type enum matching the database enum
#[derive(Debug, Serialize, Deserialize, sqlx::Type)]
#[sqlx(type_name = "transaction_type", rename_all = "lowercase")]
pub enum TransactionType {
    Generate,
    Style,
    Edit,
}

// Users
#[derive(Debug, Deserialize)]
pub struct CreateUser {
    pub email: String,
    pub username: String,
}

#[derive(Debug, Serialize)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub username: String,
    pub inkbucks: i32,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateUser {
    pub email: Option<String>,
    pub username: Option<String>,
    pub inkbucks: Option<i32>,
}

// Icon Packs
#[derive(Debug, Deserialize)]
pub struct CreateIconPack {
    pub user_id: Uuid,
    pub name: String,
}

#[derive(Debug, Serialize)]
pub struct IconPack {
    pub id: Uuid,
    pub user_id: Uuid,
    pub name: String,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateIconPack {
    pub name: Option<String>,
}

// Icons
#[derive(Debug, Deserialize)]
pub struct CreateIcon {
    pub user_id: Uuid,
    pub icon_pack_id: Option<Uuid>,
    pub image_url: String,
    pub metadata: Option<serde_json::Value>,
}

#[derive(Debug, Serialize)]
pub struct Icon {
    pub id: Uuid,
    pub user_id: Uuid,
    pub icon_pack_id: Option<Uuid>,
    pub image_url: String,
    pub metadata: Option<serde_json::Value>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize)]
pub struct UpdateIcon {
    pub image_url: Option<String>,
    pub metadata: Option<serde_json::Value>,
}

// Transactions
#[derive(Debug, Deserialize)]
pub struct CreateTransaction {
    pub user_id: Uuid,
    pub type_: TransactionType,
    pub icon_id: Uuid,
    pub amount: i32,
}

#[derive(Debug, Serialize)]
pub struct Transaction {
    pub id: Uuid,
    pub user_id: Uuid,
    pub type_: TransactionType,
    pub icon_id: Uuid,
    pub amount: i32,
    pub created_at: DateTime<Utc>,
}
