use std::path::Path;

use winreg::enums::*;
use winreg::RegKey;

use super::models::{ComputerScanResult, ComputerThreat};

fn push_file_threat(threats: &mut Vec<ComputerThreat>, path: &str) {
    threats.push(ComputerThreat {
        id: path.to_string(),

        name: "Suspicious File".into(),

        path: path.to_string(),

        threat_type: "file".into(),
    });
}

fn scan_program_data(threats: &mut Vec<ComputerThreat>) -> bool {
    let paths = [
        r"C:\ProgramData\assistant\opera.exe",
        r"C:\ProgramData\assistant\opera_elf.dll",
        r"C:\ProgramData\assistantMgC\opera.exe",
        r"C:\ProgramData\assistantMgC\opera_elf.dll",
    ];

    let mut found = false;

    for path in paths {
        if Path::new(path).exists() {
            found = true;

            push_file_threat(threats, path);
        }
    }

    found
}

fn scan_hkcu_run(threats: &mut Vec<ComputerThreat>) -> bool {
    let hkcu = RegKey::predef(HKEY_CURRENT_USER);

    let Ok(run) = hkcu.open_subkey(r"Software\Microsoft\Windows\CurrentVersion\Run") else {
        return false;
    };

    let Ok(value): Result<String, _> = run.get_value("Opera") else {
        return false;
    };

    threats.push(ComputerThreat {
        id: "hkcu-opera".into(),

        name: "Startup Entry".into(),

        path: value,

        threat_type: "registry".into(),
    });

    true
}

fn scan_hklm_run(threats: &mut Vec<ComputerThreat>) -> bool {
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);

    let Ok(run) = hklm.open_subkey(r"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run")
    else {
        return false;
    };

    let Ok(value): Result<String, _> = run.get_value("Opera") else {
        return false;
    };

    threats.push(ComputerThreat {
        id: "hklm-opera".into(),

        name: "Startup Entry".into(),

        path: value,

        threat_type: "registry".into(),
    });

    true
}

pub fn scan_computer() -> ComputerScanResult {
    let mut threats = vec![];

    let file_found = scan_program_data(&mut threats);

    let registry_found = scan_hkcu_run(&mut threats) || scan_hklm_run(&mut threats);

    let infected = file_found && registry_found;

    let score = threats.len() as u32 * 100;

    ComputerScanResult {
        infected,

        score,

        threats,
    }
}
