import { promises as fs } from "fs";
import { spawn } from "promisify-child-process";
import tmp from "tmp";
import path from "path";

export async function uploadChannel(uint8array) {

  const dataDir = tmp.dirSync({ unsafeCleanup: true });
  const filename = path.join(dataDir.name, "channel.poi");
  const spiffsFilename = tmp.tmpNameSync();

  // 3 steps for upload: save data, generate spiffs file and upload
  try {
    await saveBinaryFile(filename, uint8array);
    await mkSpiffs( dataDir.name, spiffsFilename);
    await uploadSpiffs(spiffsFilename);
  } catch (err) {
     console.error("Unable to upload channel data:", err);
  } 

  // cleanup
  try {
    dataDir.removeCallback();
    await fs.unlink(spiffsFilename);
  } catch(err) {
    // do nothing, when clean fails
  }
}

async function saveBinaryFile(filename, uint8array) {
  console.log(`Saving poi channel data to ${filename}`);
  fs.writeFile(filename, uint8array);
  console.log(`Poi channel data has been saved to ${filename}`);
}

async function mkSpiffs(dir, filename) {

  console.log(`Generating spiffs image to ${filename}`);
  const spawnProcess = spawn("./resources/bin/mkspiffs", [ "-c", dir, "-b", "4096", "-p", "256", "-s", "0x2B0000", filename]);

  spawnProcess.stdout.on("data", (data) => {
    var str = data.toString();
    var lines = str.split(/(\r?\n)/g);
    console.log("mkSpiffs:", lines.join(""));
  });
  spawnProcess.stderr.on("data", (data) => {
    var str = data.toString();
    var lines = str.split(/(\r?\n)/g);
    console.error("mkSpiffs err:", lines.join(""));
  });
  spawnProcess.on("close", (code) => {
    if (code === 0) {
      console.log(`mkSpiffs exited with code ${code}`);
      console.log(`Generating spiffs image to ${filename}`);
    } else {
      console.error(`mkSpiffs exited with code ${code}`);
    }
  });

  await spawnProcess;
  console.log("done with mkSpiffs.");
} 

async function uploadSpiffs(filename) {

  const spawnProcess = spawn("./resources/bin/esptool.exe", ["--chip", "esp32", "--port", "COM4", "--baud", "921600",
    "write_flash", "-z", "0x150000", filename]);

  spawnProcess.stdout.on("data", (data) => {
    var str = data.toString();
    var lines = str.split(/(\r?\n)/g);
    console.log("esptool:", lines.join(""));
  });
  spawnProcess.stderr.on("data", (data) => {
    var str = data.toString();
    var lines = str.split(/(\r?\n)/g);
    console.error("esptool err:", lines.join(""));
  });
  spawnProcess.on("close", (code) => {
    if (code === 0) {
      console.log(`esptool exited with code ${code}`);
    } else {
      console.error(`esptool exited with code ${code}`);
    }
  });

  await spawnProcess;
  console.log("done with esptool.");
} 