use tauri::{Manager, WindowEvent};

use crate::settings::storage::load_settings;

pub fn setup_window_events(app: &tauri::App) {
    let Some(window) = app.get_webview_window("main") else {
        return;
    };

    window.clone().on_window_event(move |event| match event {
        WindowEvent::CloseRequested { api, .. } => {
            let settings = load_settings();

            if settings.close_to_tray {
                api.prevent_close();

                let _ = window.hide();
            }
        }

        WindowEvent::Resized(_) => {
            let settings = load_settings();

            if !settings.minimize_to_tray {
                return;
            }

            match window.is_minimized() {
                Ok(true) => {
                    let _ = window.hide();
                }

                _ => {}
            }
        }

        _ => {}
    });
}
