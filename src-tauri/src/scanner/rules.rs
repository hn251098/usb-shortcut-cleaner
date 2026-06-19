use std::fs;
use std::path::Path;

fn is_ignored_entry(name: &str) -> bool {
    matches!(
        name.to_ascii_lowercase().as_str(),
        "attt.ico"
            | "autorun.inf"
            | "inf.bin"
            | "mtext.bin"
            | "recycler"
            | "system volume information"
    )
}

fn has_lnk_and_documents(dir: &Path) -> bool {
    let entries = match fs::read_dir(dir) {
        Ok(entries) => entries,
        Err(_) => return false,
    };

    let dir_name = dir.file_name().and_then(|n| n.to_str());

    let mut has_matching_lnk = false;
    let mut has_documents = false;

    for entry in entries.flatten() {
        let path = entry.path();

        if path.is_file() {
            let is_lnk = path
                .extension()
                .map(|ext| ext.eq_ignore_ascii_case("lnk"))
                .unwrap_or(false);

            if is_lnk {
                // Nếu đang ở thư mục con thì yêu cầu
                // shortcut trùng tên thư mục
                if let Some(parent_name) = dir_name {
                    if let Some(shortcut_name) = path.file_stem().and_then(|n| n.to_str()) {
                        if shortcut_name.eq_ignore_ascii_case(parent_name) {
                            has_matching_lnk = true;
                        }
                    }
                } else {
                    // Root USB: chỉ cần có .lnk
                    has_matching_lnk = true;
                }
            }
        }

        if path.is_dir() {
            if let Some(name) = path.file_name().and_then(|n| n.to_str()) {
                if name.eq_ignore_ascii_case("Documents") {
                    has_documents = true;
                }
            }
        }

        if has_matching_lnk && has_documents {
            return true;
        }
    }

    false
}

pub fn has_shortcut_documents_pattern(root: &Path) -> bool {
    // Variant A:
    // E:\
    // ├── *.lnk
    // └── Documents\
    if has_lnk_and_documents(root) {
        return true;
    }

    // Variant B:
    // DATA_PN60YRTN\
    // ├── DATA_PN60YRTN.lnk
    // └── Documents\
    let entries = match fs::read_dir(root) {
        Ok(entries) => entries,
        Err(_) => return false,
    };

    for entry in entries.flatten() {
        let dir_path = entry.path();

        if !dir_path.is_dir() {
            continue;
        }

        let dir_name = match dir_path.file_name().and_then(|n| n.to_str()) {
            Some(name) => name,
            None => continue,
        };

        if is_ignored_entry(dir_name) {
            continue;
        }

        if has_lnk_and_documents(&dir_path) {
            return true;
        }
    }

    false
}
