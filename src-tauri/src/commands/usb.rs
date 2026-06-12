use crate::cleaner::cleaner::clean_usb;
use crate::models::cleanup_result::CleanupResult;
use crate::models::scan_result::ScanResult;
use crate::models::usb_device::UsbDevice;
use crate::monitor::usb_monitor::get_usb_devices;
use crate::scanner::scanner::scan_usb;

#[tauri::command]
pub fn get_connected_usb() -> Vec<UsbDevice> {
    // state.devices.lock().unwrap().clone()
    get_usb_devices()
}

#[tauri::command]
pub fn scan_drive(drive_letter: String) -> ScanResult {
    scan_usb(&drive_letter)
}

#[tauri::command]
pub fn clean_usb_command(drive_letter: String) -> Result<CleanupResult, String> {
    clean_usb(&drive_letter)
}
