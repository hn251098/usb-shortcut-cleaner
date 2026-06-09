use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CleanupResult {
    pub success: bool,

    pub restored_attributes: bool,

    pub removed_shortcuts: u32,

    pub removed_documents: bool,

    pub message: String,
}
