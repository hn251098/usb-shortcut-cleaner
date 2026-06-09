use std::path::Path;

use crate::models::scan_result::{ScanResult, ScanStatus};

use super::rules::{has_documents_folder, has_shortcut_file};

pub fn scan_usb(drive_letter: &str) -> ScanResult {
    let root = Path::new(drive_letter);

    let mut reasons = Vec::<String>::new();

    let shortcut_detected = has_shortcut_file(root);

    if !shortcut_detected {
        return ScanResult {
            drive_letter: drive_letter.to_string(),

            status: ScanStatus::Safe,

            score: 0,

            reasons,
        };
    }

    reasons.push("Shortcut file detected in USB root".to_string());

    if has_documents_folder(root) {
        reasons.push("Documents folder detected".to_string());

        return ScanResult {
            drive_letter: drive_letter.to_string(),

            status: ScanStatus::Infected,

            score: 100,

            reasons,
        };
    }

    ScanResult {
        drive_letter: drive_letter.to_string(),

        status: ScanStatus::Suspicious,

        score: 50,

        reasons,
    }
}
