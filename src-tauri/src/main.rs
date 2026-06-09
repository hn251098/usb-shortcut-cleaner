// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod cleaner;
mod commands;
mod models;
mod monitor;
mod scanner;
mod services;
mod settings;
mod state;

use commands::usb::clean_usb_command;
use commands::usb::get_connected_usb;
use commands::usb::scan_drive;

use settings::commands::get_settings;
use settings::commands::update_settings;

use monitor::usb_monitor::start_usb_monitor;

use services::tray::setup_tray;

use state::AppState;

use tauri_plugin_autostart::MacosLauncher;

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            devices: std::sync::Mutex::new(vec![]),
        })
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            None,
        ))
        .invoke_handler(tauri::generate_handler![
            get_connected_usb,
            scan_drive,
            clean_usb_command,
            get_settings,
            update_settings
        ])
        .setup(|app| {
            setup_tray(app)?;

            start_usb_monitor(app.handle().clone());

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri");
}
