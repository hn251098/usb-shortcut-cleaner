use std::fs;
use std::path::Path;

use winreg::enums::*;
use winreg::RegKey;

use super::models::CleanComputerResult;

fn remove_file_if_exists(path: &str, removed: &mut Vec<String>, errors: &mut Vec<String>) {
    let file = Path::new(path);

    if !file.exists() {
        return;
    }

    match fs::remove_file(file) {
        Ok(_) => {
            removed.push(path.to_string());
        }

        Err(err) => {
            errors.push(format!("{} => {}", path, err));
        }
    }
}

fn remove_folder_if_empty(path: &str, removed: &mut Vec<String>, errors: &mut Vec<String>) {
    let folder = Path::new(path);

    if !folder.exists() {
        return;
    }

    let is_empty = match fs::read_dir(folder) {
        Ok(mut dir) => dir.next().is_none(),

        Err(_) => false,
    };

    if !is_empty {
        return;
    }

    match fs::remove_dir(folder) {
        Ok(_) => {
            removed.push(path.to_string());
        }

        Err(err) => {
            errors.push(format!("{} => {}", path, err));
        }
    }
}

fn remove_hkcu_run(removed: &mut Vec<String>, errors: &mut Vec<String>) {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);

    let Ok(run) =
        hkcu.open_subkey_with_flags(r"Software\Microsoft\Windows\CurrentVersion\Run", KEY_WRITE)
    else {
        return;
    };

    for name in ["assistant", "assistantMgC"] {
        match run.delete_value(name) {
            Ok(_) => {
                removed.push(format!(r"HKCU Run\{}", name));
            }
            Err(err) => {
                if err.kind() != std::io::ErrorKind::NotFound {
                    errors.push(format!(r"HKCU Run\{} => {}", name, err));
                }
            }
        }
    }
}

fn remove_hklm_run(removed: &mut Vec<String>, errors: &mut Vec<String>) {
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);

    let Ok(run) = hklm.open_subkey_with_flags(
        r"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run",
        KEY_READ | KEY_WRITE,
    ) else {
        return;
    };

    for item in run.enum_values() {
        let Ok((name, _)) = item else {
            continue;
        };

        let Ok(value): Result<String, _> = run.get_value(&name) else {
            continue;
        };

        let valid_name = matches!(name.as_str(), "assistant" | "assistantMgC");

        let valid_path = matches!(
            value.as_str(),
            r"C:\ProgramData\assistant\opera.exe" | r"C:\ProgramData\assistantMgC\opera.exe"
        );

        if !(valid_name && valid_path) {
            continue;
        }

        match run.delete_value(&name) {
            Ok(_) => {
                removed.push(format!(r"HKLM Run\{}", name));
            }
            Err(err) => {
                errors.push(format!(r"HKLM Run\{} => {}", name, err));
            }
        }
    }
}

pub fn clean_computer() -> CleanComputerResult {
    let mut removed = vec![];

    let mut errors = vec![];

    remove_file_if_exists(
        r"C:\ProgramData\assistant\opera.exe",
        &mut removed,
        &mut errors,
    );

    remove_file_if_exists(
        r"C:\ProgramData\assistant\opera_elf.dll",
        &mut removed,
        &mut errors,
    );

    remove_file_if_exists(
        r"C:\ProgramData\assistantMgC\opera.exe",
        &mut removed,
        &mut errors,
    );

    remove_file_if_exists(
        r"C:\ProgramData\assistantMgC\opera_elf.dll",
        &mut removed,
        &mut errors,
    );

    remove_folder_if_empty(r"C:\ProgramData\assistant", &mut removed, &mut errors);

    remove_folder_if_empty(r"C:\ProgramData\assistantMgC", &mut removed, &mut errors);

    remove_hkcu_run(&mut removed, &mut errors);

    remove_hklm_run(&mut removed, &mut errors);

    CleanComputerResult {
        success: errors.is_empty(),

        removed_items: removed,

        errors,
    }
}
