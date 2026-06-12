use crate::security::cleaner::clean_computer;
use crate::security::models::CleanComputerResult;

use super::models::ComputerScanResult;
use super::scanner::scan_computer;

#[tauri::command]
pub fn scan_computer_command() -> ComputerScanResult {
    scan_computer()
}

#[tauri::command]
pub fn clean_computer_command() -> CleanComputerResult {
    clean_computer()
}
