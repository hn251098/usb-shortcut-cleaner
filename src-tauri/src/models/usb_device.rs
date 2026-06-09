use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct UsbDevice {
    pub drive_letter: String,
    pub volume_name: String,

    pub total_space: u64,
    pub available_space: u64,

    pub file_system: String,
}
