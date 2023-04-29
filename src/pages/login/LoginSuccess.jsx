import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { sendMessageToMain } from "../../utils/sendMessage";

const LoginSuccess = () => {
  const navigate = useNavigate();
    console.log("TESTTEST")

  const getTokenParamValue = () => {
    const regex = /(\?|\&)([^=]+)\=([^\&]+)/g;
    const rawParams = window.location.hash.replace("#", "?").match(regex);
    return rawParams
      ?.filter((paramString) => paramString.includes("access_token"))[0]
      .split("=")[1];
  };
  console.log({test : window.location.query})

  useEffect(() => {
    if (!localStorage.getItem("bitbucket_token")) {
      localStorage.setItem("bitbucket_token", getTokenParamValue());
      window.dispatchEvent(new Event("storage"));
    }
    sendMessageToMain('bitbucket-login-success', true)
    navigate("/")
  }, []);

  return <div>LoginSuccess!</div>;
};

export default LoginSuccess;
