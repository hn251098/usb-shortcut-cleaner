use std::fs;
use std::path::Path;

pub fn remove_shortcuts(drive_letter: &str) -> Result<u32, String> {
    let root = Path::new(drive_letter);

    let mut count = 0;

    let entries = fs::read_dir(root).map_err(|e| e.to_string())?;

    for entry in entries.flatten() {
        let path = entry.path();

        let is_lnk = path
            .extension()
            .map(|ext| ext.eq_ignore_ascii_case("lnk"))
            .unwrap_or(false);

        if is_lnk {
            fs::remove_file(&path).map_err(|e| e.to_string())?;

            count += 1;
        }
    }

    Ok(count)
}

pub fn remove_documents_folder(drive_letter: &str) -> Result<bool, String> {
    let root = Path::new(drive_letter);

    let documents = root.join("Documents");

    if !documents.exists() {
        return Ok(false);
    }

    fs::remove_dir_all(&documents).map_err(|e| e.to_string())?;

    Ok(true)
}
