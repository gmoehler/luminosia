import { promises as fs } from "fs";
import { spawn } from "promisify-child-process";
import tmp from "tmp";
import path from "path";
import kill from "tree-kill";

export const doneMessage = "Upload completed.";
export const doneWithErrorMessage = "Unable to upload channel data";
export const doneWithCancelledMessage = "Upload cancelled.";

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
      await uploadSpiffs(spiffsFilename, portCache, log);
      log(`${doneMessage}\n`);
    } else {
      throw (new Error("cancelled"));
    }
  } catch (err) {
    if (currentActiveProcess) {
     console.error("Unable to upload channel data:", err);
     log(`${doneWithErrorMessage}:`, err);
     portCache = null;
    }
    else {
      log(`${doneWithCancelledMessage}.`);
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

async function saveBinaryFile(filename, uint8array, log) {
  log(`Saving poi channel data to ${filename}...`);
  await fs.writeFile(filename, uint8array);
  log("Done\n");
}

async function mkSpiffs(dir, filename, log) {

  log(`Generating spiffs image ${filename}...\n`);
  currentActiveProcess = spawn("./resources/bin/mkspiffs", [ "-c", dir, "-b", "4096", "-p", "256", "-s", "0x2B0000", filename]);

  currentActiveProcess.stdout.on("data", (data) => {
    const str = data.toString();
    const lines = str.split(/(\r?\n)/g);
    log(lines.join("\n"));
  });
  currentActiveProcess.stderr.on("data", (data) => {
    const str = data.toString();
    const lines = str.split(/(\r?\n)/g);
    log("[Error]", lines.join("\n"));
  });
  currentActiveProcess.on("close", (code) => {
    if (code > 1) {
      log(`[Error]mkSpiffs exited with code ${code}.\n`);
    }
  });

  await currentActiveProcess;
  log("Done generating spiffs image.\n");
} 

async function uploadSpiffs(filename, port, log) {

  const params =  ["--chip", "esp32", "--baud", "921600", "write_flash", "-z", "0x150000", filename];

  if (port) {
    params.unshift("--port", port);
    log(`Uploading spiffs image to port ${port}...\n`);
  } else {
    log("Detecting port and uploading image...\n");
  }

  currentActiveProcess = spawn("./resources/bin/esptool.exe", params);

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
    log("[Error]", lines.join(""));
  });
  currentActiveProcess.on("close", (code) => {
    if (code > 1) {
      log(`[Error]esptool exited with code ${code}.\n`);
    }
  });

  await currentActiveProcess;
  log("Done uploading channel data.\n");
} 

export function killCurrentProcess() {
  if (currentActiveProcess) {
    const pid = currentActiveProcess.pid;
    kill(pid);
    currentActiveProcess = null;
  }
}
