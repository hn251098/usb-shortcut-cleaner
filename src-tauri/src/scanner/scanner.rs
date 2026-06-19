use std::path::Path;

use crate::models::scan_result::{ScanResult, ScanStatus};

use super::rules::has_shortcut_documents_pattern;

pub fn scan_usb(drive_letter: &str) -> ScanResult {
    let root = Path::new(drive_letter);

    let mut reasons = Vec::<String>::new();

    let infected_pattern = has_shortcut_documents_pattern(root);

    if infected_pattern {
        reasons.push(
            "Detected folder containing both a matching shortcut file and Documents folder"
                .to_string(),
        );

        return ScanResult {
            drive_letter: drive_letter.to_string(),
            status: ScanStatus::Infected,
            score: 100,
            reasons,
        };
    }

    ScanResult {
        drive_letter: drive_letter.to_string(),
        status: ScanStatus::Safe,
        score: 0,
        reasons,
    }
}
