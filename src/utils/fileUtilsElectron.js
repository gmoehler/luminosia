import { promises as fs } from "fs";
import { spawn } from "promisify-child-process";
import tmp from "tmp";
import path from "path";
import kill from "tree-kill";
import { doneMessage, doneWithErrorMessage, doneWithCancelledMessage } from "../components/UploadLogView";
import downloadRelease from "download-github-release";

let portCache = null;
let currentActiveProcess = null;

export async function uploadChannel(uint8array, log) {
  const dataDir = tmp.dirSync({ unsafeCleanup: true });
  const filename = path.join(dataDir.name, "channel.poi");
  const spiffsFilename = tmp.tmpNameSync();

  // 3 steps for upload: save data, generate spiffs file and upload
  try {
    await saveBinaryFile(filename, uint8array, log);
    await mkSpiffs( dataDir.name, spiffsFilename, log);
    if (currentActiveProcess) {
      await upload(spiffsFilename, "0x150000", portCache, log);
      log(`${doneMessage}\n`);
    } else {
      throw (new Error("cancelled"));
    }
  } catch (err) {
    if (currentActiveProcess) {
     console.error("Unable to upload channel data:", err);
     console.trace();
     const errorInfo = err.stack ? err.stack : err.toString();
     log(`${doneWithErrorMessage}: ${errorInfo}\n`);
     portCache = null;
    } else {
      log(`${doneWithCancelledMessage}\n`);
    }
  } 

  // cleanup
  currentActiveProcess = null;
  try {
    dataDir.removeCallback();
    await fs.unlink(spiffsFilename);
  } catch(err) {
    // do nothing, when clean fails
  }
  
}

export async function updateFirmware(log) {
  const downloadDir = tmp.dirSync({ unsafeCleanup: true });
  const assetName = "firmware.bin";
  const downloadedAsset = path.join(downloadDir.name, assetName);

  // 2 steps for update firmware: download firmware and upload
  try {
    await downloadFirmware(assetName, downloadDir.name, log);
    await upload(downloadedAsset, "0x00010000", portCache, log);
    log(`${doneMessage}\n`);
  } catch (err) {
    if (currentActiveProcess) {
     console.error("Unable to update firmware:", err);
     log(`${doneWithErrorMessage}: ${err}\n`);
     portCache = null;
    }
    else {
      log(`${doneWithCancelledMessage}.\n`);
    }
  } 

  // cleanup
  currentActiveProcess = null;
  try {
    downloadDir.removeCallback();
  } catch(err) {
    // do nothing, when clean fails
  }
  
}

async function saveBinaryFile(filename, uint8array, log) {
  log(`Saving poi channel data to ${filename}...`);
  await fs.writeFile(filename, uint8array);
  log("Done\n");
}

async function mkSpiffs(dir, filename, log) {

  const { app } = require("electron").remote;
  if (app) {
    const userDataPath = app.getPath("userData");
    console.log(`userDataPath:: ${userDataPath}`);
    log(`userDataPath:: ${userDataPath}\n`);
    const exePath = app.getPath("exe");
    console.log(`exePath:: ${exePath}`);
    log(`exePath:: ${exePath}\n`);
    const appPath = app.getAppPath();
    console.log(`appPath:: ${appPath}`);
    log(`appPath:: ${appPath}\n`);
  } else {
    console.log(`app:: ${app}`);
    log(`app:: ${app}\n`);
}

  log(`Generating spiffs image ${filename}...\n`);
  const baseDir = process.platform === "linux" ? "/opt/LuminosiaStudio" : process.cwd();
  const exe = path.join(baseDir, "resources", "bin", "mkspiffs");
  currentActiveProcess = spawn(exe, [ "-c", dir, "-b", "4096", "-p", "256", "-s", "0x2B0000", filename]);

  currentActiveProcess.stdout.on("data", (data) => {
    const str = data.toString();
    const lines = str.split(/(\r?\n)/g);
    log(lines.join("\n"));
  });
  currentActiveProcess.stderr.on("data", (data) => {
    const str = data.toString();
    const lines = str.split(/(\r?\n)/g);
    const logStr = lines.join("\n");
    console.error(logStr);
    log(`[Error] ${logStr}`);
  });
  currentActiveProcess.on("error", (err) => {
    console.error(err);
    log(`[Error] ${err}`);
  });
  currentActiveProcess.on("close", (code) => {
    if (code > 1) {
      log(`[Error]mkSpiffs exited with code ${code}.\n`);
    }
  });

  await currentActiveProcess;
  log("Done generating spiffs image.\n");
} 

async function upload(filename, addr, port, log) {

  const baseDir = process.platform === "linux" ? "/opt/LuminosiaStudio" : process.cwd();
  const exe = path.join(baseDir, "resources", "bin", "esptool");
  const params =  ["--chip", "esp32", "--baud", "921600", "write_flash", "-z", addr, filename];

  if (port) {
    params.unshift("--port", port);
    log(`Uploading to port ${port}...\n`);
  } else {
    log("Autodetecting port for upload...\n");
  }

  currentActiveProcess = spawn(exe, params);

  currentActiveProcess.stdout.on("data", (data) => {
    // potentially update port cache
    const m = /Serial port ([a-zA-Z0-9]+)/.exec(data);
    if (m) {
      portCache = m.length > 0 ? m[1] : null;
      if (portCache) {
        log(`\nPort cache set to ${portCache}.\n`);
      }
    }
    const str = data.toString();
    const lines = str.split(/(\r?\n)/g);
    log(lines.join(""));
  });
  currentActiveProcess.stderr.on("data", (data) => {
    const str = data.toString();
    const lines = str.split(/(\r?\n)/g);
    const logStr = lines.join("\n");
    console.error(logStr);
    log(`[Error] ${logStr}`);
  });
  currentActiveProcess.on("error", (err) => {
    console.error(err);
    log(`[Error] ${err}`);
  });

  currentActiveProcess.on("close", (code) => {
    if (code > 1) {
      log(`[Error]esptool exited with code ${code}.\n`);
    }
  });

  await currentActiveProcess;
} 

async function downloadFirmware(assetName, outputdir, log) {
 
  const user = "gmoehler";
  const repo = "ledpoi";
  const leaveZipped = false;
 
  // Define a function to filter releases.
  function filterRelease(release) {
    return release.prerelease === false;
  }
 
  // Define a function to filter assets.
  function filterAsset(asset) {
    return asset.name === assetName;
  }
  
  log(`Downloading firmware '${assetName}' to ${outputdir}...`);
  try {
    await downloadRelease(user, repo, outputdir, filterRelease, filterAsset, leaveZipped);
  } catch (err) {
    // not sure err is set
    currentActiveProcess=true; // hack to show real error
    throw err;
  }
  
  log("Done.\n");
}

export function killCurrentProcess() {
  if (currentActiveProcess) {
    const pid = currentActiveProcess.pid;
    kill(pid);
    currentActiveProcess = null;
  }
}
