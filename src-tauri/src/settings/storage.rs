use std::{fs, path::PathBuf};

use super::model::AppSettings;

fn settings_file() -> PathBuf {
    let mut path = dirs::config_dir().unwrap();

    path.push("usb-virus-cleaner");

    fs::create_dir_all(&path).ok();

    path.push("settings.json");

    path
}

pub fn load_settings() -> AppSettings {
    let path = settings_file();

    if !path.exists() {
        return AppSettings::default();
    }

    let content = fs::read_to_string(path);

    match content {
        Ok(content) => serde_json::from_str(&content).unwrap_or_default(),

        Err(_) => AppSettings::default(),
    }
}

pub fn save_settings(
    settings: &AppSettings,
) -> Result<(), String> {
    let path =
        settings_file();

    let content =
        serde_json::to_string_pretty(
            settings,
        )
        .map_err(|e| e.to_string())?;

    fs::write(path, content)
        .map_err(|e| e.to_string())?;

    Ok(())
}