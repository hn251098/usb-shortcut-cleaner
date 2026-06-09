use crate::models::usb_device::UsbDevice;

use std::ffi::OsString;
use std::os::windows::ffi::OsStringExt;

use windows::core::PWSTR;

use windows::Win32::Storage::FileSystem::{
    GetDiskFreeSpaceExW, GetDriveTypeW, GetLogicalDrives, GetVolumeInformationW,
};

use std::{collections::HashMap, time::Duration};

use tauri::Emitter;

use tokio::time::sleep;

fn widestring_to_string(buffer: &[u16]) -> String {
    let len = buffer.iter().position(|c| *c == 0).unwrap_or(buffer.len());

    OsString::from_wide(&buffer[..len])
        .to_string_lossy()
        .to_string()
}

pub fn get_usb_devices() -> Vec<UsbDevice> {
    let mut devices = Vec::new();

    unsafe {
        let drives = GetLogicalDrives();
        const DRIVE_REMOVABLE: u32 = 2;
        for i in 0..26 {
            if drives & (1 << i) == 0 {
                continue;
            }

            let letter = (b'A' + i as u8) as char;

            let drive = format!("{}:\\", letter);

            let drive_utf16: Vec<u16> = drive.encode_utf16().chain(std::iter::once(0)).collect();

            let drive_type = GetDriveTypeW(PWSTR(drive_utf16.as_ptr() as *mut _));

            if drive_type != DRIVE_REMOVABLE {
                continue;
            }

            let mut volume_name = [0u16; 260];

            let mut fs_name = [0u16; 260];

            let mut serial = 0u32;

            let mut max_comp_len = 0u32;

            let mut flags = 0u32;

            let _ = GetVolumeInformationW(
                PWSTR(drive_utf16.as_ptr() as *mut _),
                Some(&mut volume_name),
                Some(&mut serial),
                Some(&mut max_comp_len),
                Some(&mut flags),
                Some(&mut fs_name),
            );

            let mut free_bytes = 0u64;

            let mut total_bytes = 0u64;

            let mut total_free = 0u64;

            let _ = GetDiskFreeSpaceExW(
                PWSTR(drive_utf16.as_ptr() as *mut _),
                Some(&mut free_bytes),
                Some(&mut total_bytes),
                Some(&mut total_free),
            );

            devices.push(UsbDevice {
                drive_letter: drive.clone(),

                volume_name: widestring_to_string(&volume_name),

                total_space: total_bytes,

                available_space: free_bytes,

                file_system: widestring_to_string(&fs_name),
            });
        }
    }

    devices
}

pub fn start_usb_monitor(app: tauri::AppHandle) {
    tauri::async_runtime::spawn(async move {
        let mut previous = HashMap::<String, UsbDevice>::new();

        loop {
            let current_list = get_usb_devices();

            let current = current_list
                .iter()
                .map(|d| (d.drive_letter.clone(), d.clone()))
                .collect::<HashMap<_, _>>();

            for (drive, device) in &current {
                if !previous.contains_key(drive) {
                    let _ = app.emit("usb-inserted", device);
                    use crate::scanner::scanner::scan_usb;
                    let result = scan_usb(&device.drive_letter);
                    let _ = app.emit("scan-result", &result);
                }
            }

            for (drive, device) in &previous {
                if !current.contains_key(drive) {
                    let _ = app.emit("usb-removed", device);
                }
            }

            previous = current;

            sleep(Duration::from_secs(2)).await;
        }
    });
}
