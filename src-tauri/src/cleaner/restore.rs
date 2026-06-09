use std::process::Command;

pub fn restore_attributes(drive_letter: &str) -> Result<(), String> {
    let path = format!("{}\\*.*", drive_letter);

    let output = Command::new("attrib")
        .args(["-h", "-r", "-s", "/s", "/d", &path])
        .output()
        .map_err(|e| e.to_string())?;

    if output.status.success() {
        Ok(())
    } else {
        Err(String::from_utf8_lossy(&output.stderr).to_string())
    }
}
