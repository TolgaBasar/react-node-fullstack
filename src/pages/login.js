import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/login`, {
        username,
        password,
      });

      if (res.data && res.data.user) {
        localStorage.setItem("token", res.data.token || "dummy-token");
        localStorage.setItem("manager", JSON.stringify(res.data.user));
        navigate("/users");
      } else {
        alert("Hatalı kullanıcı adı veya şifre.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      alert("Kullanıcı Adı Veya Şifre Hatalı!");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h3 className="login-title">Giriş Yap</h3>
        <form onSubmit={handleLogin}>
          <input
            className="form-control mb-2"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="form-control mb-3"
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn btn-danger w-100">Giriş</button>
        </form>
        <p className="mt-3 text-center">
          Üye değil misiniz? <a href="/register">Kayıt Ol</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
