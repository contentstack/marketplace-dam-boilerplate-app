const { exec } = require("child_process");
const readlineSync = require("readline-sync");

(async () => {
  try {
    const uiOrRte = readlineSync.keyInSelect(
      ["UI", "RTE"],
      "Which server do you want to start?"
    );

    if (uiOrRte === -1) {
      console.log("No option selected. Exiting...");
      return;
    }

    const isUI = uiOrRte === 0;
    const folder = isUI ? "../ui" : "../ui/rte";
    const port = isUI ? 4000 : 1268;

    console.log(`\nStarting server in folder: ${folder} on port ${port}...\n`);

    // Start the selected server
    const serverProcess = exec(
      `cd ${folder} && npm start`,
      (err, stdout, stderr) => {
        if (err) {
          console.error("Error starting server:", err);
          return;
        }
        if (stderr) console.error(stderr);
        if (stdout) console.log(stdout);
      }
    );

    serverProcess.stdout?.pipe(process.stdout);
    serverProcess.stderr?.pipe(process.stderr);

    // If RTE is selected, also start UI
    if (!isUI) {
      console.log(`\n➡️ Starting UI as well (port 4000)...\n`);
      const uiProcess = exec(`cd ../ui && npm start`);
      uiProcess.stdout?.pipe(process.stdout);
      uiProcess.stderr?.pipe(process.stderr);
    }
  } catch (err) {
    console.error("Error in start-local script:", err);
  }
})();
