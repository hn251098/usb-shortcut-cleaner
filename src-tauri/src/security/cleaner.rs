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

    match run.delete_value("Opera") {
        Ok(_) => {
            removed.push("HKCU Run\\opera.exe".into());
        }

        Err(err) => {
            errors.push(format!("HKCU Run => {}", err));
        }
    }
}

fn remove_hklm_run(removed: &mut Vec<String>, errors: &mut Vec<String>) {
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);

    let Ok(run) = hklm.open_subkey_with_flags(
        r"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run",
        KEY_WRITE,
    ) else {
        return;
    };

    match run.delete_value("Opera") {
        Ok(_) => {
            removed.push("HKLM Run\\opera.exe".into());
        }

        Err(err) => {
            errors.push(format!("HKLM Run => {}", err));
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
