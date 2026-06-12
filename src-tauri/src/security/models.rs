use serde::Serialize;

#[derive(Debug, Serialize, Clone)]
pub struct ComputerThreat {
    pub id: String,

    pub name: String,

    pub path: String,

    pub threat_type: String,
}

#[derive(Debug, Serialize)]
pub struct ComputerScanResult {
    pub infected: bool,

    pub score: u32,

    pub threats: Vec<ComputerThreat>,
}

#[derive(Debug, Serialize)]
pub struct CleanComputerResult {
    pub success: bool,

    pub removed_items: Vec<String>,

    pub errors: Vec<String>,
}
