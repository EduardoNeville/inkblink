use jsonwebtoken::{decode, decode_header, Algorithm, DecodingKey, Validation};
use reqwest::Client;
use serde_json::Value;
use std::collections::HashMap;

use crate::handlers::AppError;

pub async fn get_public_keys() -> Result<HashMap<String, String>, AppError> {
    let client = Client::new();
    let res = client
        .get("https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com")
        .send()
        .await
        .map_err(|e| AppError::InternalServerError(format!("Failed to fetch public keys: {}", e)))?;
    let keys: HashMap<String, String> = res
        .json()
        .await
        .map_err(|e| AppError::InternalServerError(format!("Failed to parse public keys: {}", e)))?;
    Ok(keys)
}

pub async fn verify_id_token(token: &str, project_id: &str) -> Result<Value, AppError> {
    let header = decode_header(token)
        .map_err(|e| AppError::InternalServerError(format!("Invalid token header: {}", e)))?;
    let kid = header
        .kid
        .ok_or(AppError::InternalServerError("Missing kid in token header".to_string()))?;

    let keys = get_public_keys().await?;
    let cert = keys
        .get(&kid)
        .ok_or(AppError::InternalServerError("No matching key found".to_string()))?;

    let decoding_key = DecodingKey::from_rsa_pem(cert.as_bytes())
        .map_err(|e| AppError::InternalServerError(format!("Invalid certificate: {}", e)))?;

    let mut validation = Validation::new(Algorithm::RS256);
    validation.set_audience(&[project_id]);
    validation.set_issuer(&[format!("https://securetoken.google.com/{}", project_id)]);
    validation.set_required_spec_claims(&["exp", "iat", "sub"]);

    let token_data = decode::<Value>(token, &decoding_key, &validation)
        .map_err(|e| AppError::InternalServerError(format!("Token verification failed: {}", e)))?;
    Ok(token_data.claims)
}
