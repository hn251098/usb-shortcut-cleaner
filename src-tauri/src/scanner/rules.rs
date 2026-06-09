use std::path::Path;

pub fn has_shortcut_file(root: &Path) -> bool {
    let entries = match std::fs::read_dir(root) {
        Ok(entries) => entries,
        Err(_) => return false,
    };

    entries.flatten().any(|entry| {
        entry
            .path()
            .extension()
            .map(|ext| ext.eq_ignore_ascii_case("lnk"))
            .unwrap_or(false)
    })
}

pub fn has_documents_folder(root: &Path) -> bool {
    let entries = match std::fs::read_dir(root) {
        Ok(entries) => entries,
        Err(_) => return false,
    };

    entries.flatten().any(|entry| {
        if !entry.path().is_dir() {
            return false;
        }

        entry
            .file_name()
            .to_string_lossy()
            .eq_ignore_ascii_case("Documents")
    })
}
