import React, { useEffect } from "react";
import { useState } from "react";
import {
  sendMessageToMain,
  setupListenerFromMain,
} from "../../utils/sendMessage";
import { Box, Button, TextField, Typography } from "@mui/material";
import {
  createBranchWithAuth,
  createPRWithAuth,
} from "../../api/bitbucket/bitbucketUtils";
import { isDev } from "../../utils/constants";

import "./Home.css";
import { getPrepareCommitScript } from "../../utils/git/scripts";
import {
  camelToSnakeCase,
  formatPageName,
  toSnakeCase,
} from "../../utils/textFomatter";

const oAuthUrl = process.env.REACT_APP_CLIENT_OAUTH;
const repoUrl = process.env.REACT_APP_REPO_URL;
const Home = () => {
  const [value, setValue] = useState(0);
  const [token, setToken] = useState(localStorage.getItem("bitbucket_token"));
  const [command, setCommand] = useState("");
  const [inputData, setInputData] = useState({
    jiraTaskText: "",
    moduleNameText: "",
    pageNameText: "",
    stringNameText: "",
    locENText: "",
    locFRText: "",
    locCHTText: "",
    locCHSText: "",
  });

  const keyStart = `${inputData.moduleNameText}${
    inputData.moduleNameText !== "" ? "_" : ""
  }${formatPageName(inputData.pageNameText)}${
    inputData.pageNameText !== "" ? "_" : ""
  }`

  const keyAll = keyStart + inputData.stringNameText

  console.log(keyAll)

//   console.log(inputData);
  useEffect(() => {
    setupListenerFromMain("bitbucket-login-result", (newUrl) => {
      console.log("Listener action");
      if (!localStorage.getItem("bitbucket_token")) {
        localStorage.setItem("bitbucket_token", getTokenParamValue(newUrl));
        window.dispatchEvent(new Event("storage"));
      }
    });
  }, []);

  window.addEventListener("storage", () => {
    console.log("Change to local storage!");
    setToken(localStorage.getItem("bitbucket_token"));
  });

  const getTokenParamValue = (url) => {
    const regex = /(\?|\&)([^=]+)\=([^\&]+)/g;
    const rawParams = url.replace("#", "?").match(regex);
    return rawParams
      ?.filter((paramString) => paramString.includes("access_token"))[0]
      .split("=")[1];
  };

  const onCreatePRClick = async () => {
    await createPRWithAuth({
      targetBranch: "dev1",
      description: "My new test PR",
      title: "NEW TEST PR TITLE!",
      token: token,
    });
  };

  const onLoginClick = () => {
    isDev
      ? window.open(oAuthUrl, "_self")
      : sendMessageToMain("bitbucket-login", oAuthUrl);
  };

  const onLogoutClick = () => {
    localStorage.removeItem("bitbucket_token");
    window.dispatchEvent(new Event("storage"));
  };

  const onPrepareCommitClick = () => {
    const isFirstLaunch = localStorage.getItem("isFirstLaunch");
    localStorage.setItem("isFirstLaunch", true);
    sendMessageToMain(
      "git-prepare-commit",
      getPrepareCommitScript({
        repoUrl: repoUrl,
        repoName: "mobile-banking",
        branchName: "dev1",
        isFirstLaunch: !isFirstLaunch,
      })
    );
  };
  return (
    <div className="home-container">
      <div className="container-col">
        {/* <Button onClick={() => setValue(value + 1)}>{value}</Button>
      <Button onClick={() => sendMessageToMain("number", value)}>
        Send value
      </Button> */}
        {/* <Button onClick={onCreatePRClick}>Create a PR</Button> */}
        <div className="container-row">
          <Button onClick={onLoginClick} disabled={token !== null}>
            {token ? "Logged in" : "Login to Bitbucket"}
          </Button>
          <Button disabled={token === null} onClick={onLogoutClick}>
            Log Out
          </Button>
        </div>

        <TextField
          value={inputData.jiraTaskText}
          onChange={(e) =>
            setInputData({ ...inputData, jiraTaskText: e.target.value })
          }
          placeholder="JIRA Task"
        />
        <TextField
          value={inputData.moduleNameText}
          onChange={(e) => {
            setInputData({
              ...inputData,
              moduleNameText: e.target.value,
              keyText: `${e.target.value}_${toSnakeCase(
                inputData.pageNameText
              )}`,
            });
          }}
          placeholder="Module Name"
        />
        <TextField
          value={inputData.pageNameText}
          onChange={(e) => {
            setInputData({
              ...inputData,
              pageNameText: e.target.value,
              keyText: `${inputData.moduleNameText}_${toSnakeCase(
                e.target.value
              )}`,
            });
          }}
          placeholder="Page Name"
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <Typography sx={{ fontWeight: 500 }}>{keyStart}</Typography>
          <TextField
            value={inputData.stringNameText}
            onChange={(e) => {
              setInputData({
                ...inputData,
                stringNameText: e.target.value,
              });
            }}
            placeholder="String name"
          />
        </Box>
        <TextField
          value={inputData.locENText}
          onChange={(e) =>
            setInputData({ ...inputData, locENText: e.target.value })
          }
          placeholder="English"
        />
        <TextField
          value={inputData.locFRText}
          onChange={(e) =>
            setInputData({ ...inputData, locFRText: e.target.value })
          }
          placeholder="French"
        />
        <TextField
          value={inputData.locCHTText}
          onChange={(e) =>
            setInputData({ ...inputData, locCHTText: e.target.value })
          }
          placeholder="Chineese Traditional"
        />
        <TextField
          value={inputData.locCHSText}
          onChange={(e) =>
            setInputData({ ...inputData, locCHSText: e.target.value })
          }
          placeholder="Chineese Simplified"
        />

        {/* <TextField
        value={command}
        placeholder="Type command"
        onChange={(e) => setCommand(e.target.value)}
      />
      <Button
        onClick={() =>
          sendMessageToMain("command", {
            command: command,
            args: null,
            slug: "command",
            logging: true,
          })
        }
      >
        Test script
      </Button> */}
        {/* <Typography>Token = {token}</Typography> */}
        <div className="container-row">
          <Button
            fullWidth={false}
            onClick={onPrepareCommitClick}
            disabled={token === null}
          >
            Prepare commit
          </Button>
        </div>

        {/* <Button
        onClick={() => createBranchWithAuth(token)}
        disabled={token === null}
      >
        Create branch
      </Button> */}
      </div>
    </div>
  );
};

export default Home;
