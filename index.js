const { app, BrowserWindow, ipcMain } = require("electron");
const { spawn } = require("child_process");

let mainWindow;
let authWindow;

app.on("ready", () => {
  mainWindow = new BrowserWindow({
    title: "MCDStorm",
    icon: "favicon.ico",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // TODO: This is a Windows specific path, need to add cross
  // platform support
  mainWindow.loadURL(`${app.getAppPath()}\\build\\index.html`);
});

const executeCLI = (
  command,
  args = [],
  event,
  commandSlug,
  logging = false
) => {
  const process = spawn(command, args, { shell: true });

  process.stdout.on("data", (data) => {
    logging && console.log(`stdout: ${data}`);
    event?.sender.send(`cli-stdout-${commandSlug}`, data);
  });

  process.stderr.on("data", (data) => {
    logging && console.log(`stderr: ${data}`);
    event?.sender.send(`cli-stderr-${commandSlug}`, data);
  });

  process.on("error", (error) => {
    logging && console.log(`error: ${error.message}`);
    event?.sender.send(`cli-error-${commandSlug}`, error);
  });

  process.on("close", (code) => {
    logging && console.log(`child process exited with code ${code}`);
    event?.sender.send(`cli-close-${commandSlug}`, code);
  });
};

const addGitListeners = () => {
  ipcMain.on("git-prepare-commit", (event, prepareCommitScript) => {
    executeCLI(
      prepareCommitScript,
      [],
      event,
      "git-prepare-commit",
      true
    );
  });
}

const addBitbucketListeners = () => {
  ipcMain.on("bitbucket-login", (eventLogin, authUrl) => {
    authWindow = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      "node-integration": false,
      "web-security": false,
    });
    authWindow.loadURL(authUrl);
    authWindow.show();
    authWindow?.webContents.on("will-navigate", function (event, newUrl) {
      eventLogin.sender.send("bitbucket-login-result", newUrl);
      authWindow.close();
    });

    authWindow.on("closed", function () {
      authWindow = null;
    });
    // 'will-navigate' is an event emitted when the window.location changes
    // newUrl should contain the tokens you need
  });
};

// mainWindow.webContents.on('new-window', function(e, url) {
//     e.preventDefault();
//     require('electron').shell.openExternal(url);
//   });

const addIPCListeners = () => {
  ipcMain.on("number", (event, value) => {
    console.log(value);
  });

  ipcMain.on("command", (event, commandObject) => {
    executeCLI(
      commandObject.command,
      commandObject.args,
      event,
      "command",
      commandObject.logging
    );
  });

  addBitbucketListeners();
  addGitListeners()
};

addIPCListeners();
