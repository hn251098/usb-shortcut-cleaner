use super::{
    model::AppSettings,
    storage::{load_settings, save_settings},
};

#[tauri::command]
pub fn get_settings() -> AppSettings {
    load_settings()
}

#[tauri::command]
pub fn update_settings(settings: AppSettings) -> Result<(), String> {
    save_settings(&settings)
}
