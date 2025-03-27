use serde::{Deserialize, Serialize};
use diesel::prelude::*;
use diesel::r2d2::{ConnectionManager, Pool};
use crate::schema::{icons, users};

#[derive(Debug, Serialize, Deserialize)]
pub enum TransactionType {
    Generate,
    Style,
    Edit,
}

#[derive(Debug, Deserialize)]
pub struct CreateUser {
    pub email: String,
    pub username: String,
}

#[derive(Debug, Queryable, Serialize)]
#[diesel(table_name = users)]
pub struct User {
    pub id: i32,
    pub email: String,
    pub username: String,
    pub inkbucks: i32,
    pub uid: String,
}

#[derive(Debug, Deserialize)]
pub struct CreateIcon {
    pub user_id: i32,
    pub icon_pack_id: Option<i32>,
    pub metadata: Option<String>,
}

#[derive(Debug, Queryable, Serialize)]
#[diesel(table_name = icons)]
pub struct Icon {
    pub id: i32,
    pub user_id: i32,
    pub icon_pack_id: Option<i32>,
    pub metadata: Option<String>,
    pub image_data: Vec<u8>,
}

#[derive(Clone)]
pub struct AppState {
    pub db_pool: Pool<ConnectionManager<PgConnection>>,
}

impl AppState {
    pub async fn init() -> AppState {
        let database_url = std::env::var("DATABASE_URL")
            .unwrap_or_else(|_| "postgres://ib_usr:ib_pwd@db:5432/ib_db".to_string());
        let database_url = String::from("postgres://ib_usr:ib_pwd@db:5432/ib_db");

        println!("database_url: {}", &database_url);
        let manager = ConnectionManager::<PgConnection>::new(database_url);
        let pool = Pool::builder()
            .build(manager)
            .expect("Failed to create pool");
        AppState { db_pool: pool }
    }
}
