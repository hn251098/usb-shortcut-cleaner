// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod cleaner;
mod commands;
mod models;
mod monitor;
mod scanner;
mod security;
mod services;
mod settings;
mod window;

use commands::usb::clean_usb_command;
use commands::usb::get_connected_usb;
use commands::usb::scan_drive;

use settings::commands::get_settings;
use settings::commands::update_settings;

use monitor::usb_monitor::start_usb_monitor;

use services::tray::setup_tray;

use tauri_plugin_autostart::MacosLauncher;

use security::commands::clean_computer_command;
use security::commands::scan_computer_command;

use window::window_event::setup_window_events;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            None,
        ))
        .invoke_handler(tauri::generate_handler![
            get_connected_usb,
            scan_drive,
            clean_usb_command,
            get_settings,
            update_settings,
            scan_computer_command,
            clean_computer_command
        ])
        .setup(|app| {
            setup_tray(app)?;
            setup_window_events(app);
            start_usb_monitor(app.handle().clone());

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri");
}
