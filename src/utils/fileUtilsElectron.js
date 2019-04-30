import fs from "fs";

export function saveBinaryFile(filename, uint8array) {
  fs.writeFile(filename, uint8array, (err) => {
    if (err) throw err;
    console.log(`The file has been saved to ${filename}`);
  });
}

export function generateImage(filename) {

  var spawn = require("child_process").spawn;
  var prc = spawn("dir");

  //noinspection JSUnresolvedFunction
  prc.stdout.setEncoding("utf8");
  prc.stdout.on("data",  (data) => {
      var str = data.toString();
      var lines = str.split(/(\r?\n)/g);
      console.log(lines.join(""));
  });

  prc.on("close",  (code) => {
      console.log("process close code " + code);
  });
}