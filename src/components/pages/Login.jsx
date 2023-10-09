import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../images/logo.svg";
import "../../css/Login.css"

import AppLoading from "../organisms/AppLoading";
import { Alert } from "@mui/material";
import { saveToken } from "../../helpers/Auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [showError, setShowError] = React.useState(false);

  const handleLogin = (event) => {
    event.preventDefault();

    setIsLoading(true);

    fetch(`http://localhost:8080/auth/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-type": "application/json" },
    })
      .then((response) => response.json())
      .then(({ token }) => {
        saveToken(token);
        navigate("/dashboard");
      })
      .catch(() => {
        setEmail("");
        setPassword("");
        setShowError(true);
        setIsLoading(false);
      });
  };

  const handleInputFocus = () => {
    setShowError(false);
  };

  return isLoading ? (
    <AppLoading />
  ) : (
    <div className="container">
    <div className="login_center">
      <div className="login__logo">
        <img src={logo} className="responsive" alt="" />
      </div>
      <form onSubmit={handleLogin} className="inputs">
        <div className="input">
          <input
            type="email"
            placeholder="Usuário"
            name="email"
            id="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            onFocus={handleInputFocus}
          />
        </div>
        <div className="input">
          <input
            type="password"
            placeholder="Senha"
            name="password"
            id="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            onFocus={handleInputFocus}
          />
        </div>
        {showError && <Alert severity="error">Credenciais com erro!</Alert>}
        <button className="submit">Entrar</button>
      </form>
    </div>
    </div>
  );
}