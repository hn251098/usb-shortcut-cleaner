use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, TrayIconBuilder, TrayIconEvent},
    Emitter, Manager,
};

pub fn setup_tray(app: &tauri::App) -> tauri::Result<()> {
    let open = MenuItem::with_id(app, "open", "Mở ứng dụng", true, None::<&str>)?;

    let settings = MenuItem::with_id(app, "settings", "Cài đặt", true, None::<&str>)?;

    let quit = MenuItem::with_id(app, "quit", "Đóng ứng dụng", true, None::<&str>)?;

    let menu = Menu::with_items(app, &[&open, &settings, &quit])?;

    TrayIconBuilder::new()
        .tooltip("USB Shortcut Cleaner")
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .on_tray_icon_event(|tray, event| match event {
            TrayIconEvent::Click {
                button: MouseButton::Left,
                ..
            } => {
                if let Some(window) = tray.app_handle().get_webview_window("main") {
                    let _ = window.show();

                    let _ = window.unminimize();

                    let _ = window.set_focus();
                }
            }

            _ => {}
        })
        .on_menu_event(|app, event| match event.id().as_ref() {
            "open" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.unminimize();
                    let _ = window.set_focus();
                }
            }

            "settings" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.unminimize();
                    let _ = window.set_focus();

                    let _ = window.emit("open-settings", ());
                }
            }

            "quit" => {
                app.exit(0);
            }

            _ => {}
        })
        .build(app)?;

    Ok(())
}
