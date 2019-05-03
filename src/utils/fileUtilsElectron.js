import { promises as fs } from "fs";
import { spawn } from "promisify-child-process";
import tmp from "tmp";
import path from "path";

let portCache = null;

export async function uploadChannel(uint8array, log) {
  const dataDir = tmp.dirSync({ unsafeCleanup: true });
  const filename = path.join(dataDir.name, "channel.poi");
  const spiffsFilename = tmp.tmpNameSync();

  // 3 steps for upload: save data, generate spiffs file and upload
  try {
    log("Starting upload");
    await saveBinaryFile(filename, uint8array, log);
    await mkSpiffs( dataDir.name, spiffsFilename, log);
    await uploadSpiffs(spiffsFilename, portCache, log);
    log("Upload completed.");
  } catch (err) {
     console.error("Unable to upload channel data:", err);
     log("Unable to upload channel data:", err);
     portCache = null;
  } 

  // cleanup
  try {
    dataDir.removeCallback();
    await fs.unlink(spiffsFilename);
  } catch(err) {
    // do nothing, when clean fails
  }
  
}

async function saveBinaryFile(filename, uint8array, log) {
  log(`Saving poi channel data to ${filename}`);
  await fs.writeFile(filename, uint8array);
  log(`Poi channel data has been saved to ${filename}`);
}

async function mkSpiffs(dir, filename, log) {

  log(`Generating spiffs image to ${filename}`);
  const spawnProcess = spawn("./resources/bin/mkspiffs", [ "-c", dir, "-b", "4096", "-p", "256", "-s", "0x2B0000", filename]);

  spawnProcess.stdout.on("data", (data) => {
    const str = data.toString();
    const lines = str.split(/(\r?\n)/g);
    log(lines.join(""));
  });
  spawnProcess.stderr.on("data", (data) => {
    const str = data.toString();
    const lines = str.split(/(\r?\n)/g);
    log("[Error]", lines.join(""));
  });
  spawnProcess.on("close", (code) => {
    if (code === 0) {
      log(`mkSpiffs exited with code ${code}`);
      log(`Generating spiffs image to ${filename}`);
    } else {
      log(`[Error]mkSpiffs exited with code ${code}`);
    }
  });

  await spawnProcess;
  log("done with mkSpiffs.");
} 

async function uploadSpiffs(filename, port, log) {

  const params =  ["--chip", "esp32", "--baud", "921600", "write_flash", "-z", "0x150000", filename];

  if (port) {
    params.unshift("--port", port);
    log(`Uploading spiffs image to port ${port}`);
  }

  const spawnProcess = spawn("./resources/bin/esptool.exe", params);

  spawnProcess.stdout.on("data", (data) => {
    // potentially update port cache
    const m = /Serial port ([a-zA-Z0-9]+)/.exec(data);
    if (m) {
      portCache = m.length > 0 ? m[1] : null;
      if (portCache) {
        log(`Port cache set to ${portCache}`);
      }
    }
    const str = data.toString();
    const lines = str.split(/(\r?\n)/g);
    log(lines.join(""));
  });
  spawnProcess.stderr.on("data", (data) => {
    const str = data.toString();
    const lines = str.split(/(\r?\n)/g);
    log("[Error]", lines.join(""));
  });
  spawnProcess.on("close", (code) => {
    if (code === 0) {
      log(`esptool exited with code ${code}`);
    } else {
      log(`[Error]esptool exited with code ${code}`);
    }
  });

  await spawnProcess;
  log("done with esptool.");
} 