use crate::models::cleanup_result::CleanupResult;

use super::{
    remove::{remove_documents_folder, remove_shortcuts},
    restore::restore_attributes,
};

pub fn clean_usb(drive_letter: &str) -> Result<CleanupResult, String> {
    restore_attributes(drive_letter)?;

    let removed_shortcuts = remove_shortcuts(drive_letter)?;

    let removed_documents = remove_documents_folder(drive_letter)?;

    Ok(CleanupResult {
        success: true,

        restored_attributes: true,

        removed_shortcuts,

        removed_documents,

        message: "USB cleaned successfully".to_string(),
    })
}
