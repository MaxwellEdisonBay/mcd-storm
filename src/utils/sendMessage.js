import { isDev } from "./constants";

const ipcRenderer = isDev ? undefined : window.require("electron").ipcRenderer;

export const sendMessageToMain = (key, value) => {
  if (isDev) {
    console.log(key, value);
  } else {
    ipcRenderer?.send(key, value);
  }
};

export const setupListenerFromMain = (key, action) => {
  console.log("Listener setup");
  ipcRenderer?.on(key, (event, value) => {
    action(value);
  });
};
