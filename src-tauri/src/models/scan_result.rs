use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum ScanStatus {
    Safe,
    Suspicious,
    Infected,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ScanResult {
    pub drive_letter: String,

    pub status: ScanStatus,

    pub score: u32,

    pub reasons: Vec<String>,
}
