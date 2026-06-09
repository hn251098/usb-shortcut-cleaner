use std::sync::Mutex;

use crate::models::usb_device::UsbDevice;

pub struct AppState {
    pub devices: Mutex<Vec<UsbDevice>>,
}
