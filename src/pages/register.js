import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./register.css"; // ✅ mevcut CSS korunuyor

function Register() {
  const [form, setForm] = useState({
    manager_name: "",
    manager_surname: "",
    manager_username: "",
    manager_password: "",
    manager_mail: "",
  });

  const [loading, setLoading] = useState(false); // ✅ Spinner kontrolü
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Spinner başlat
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/register`, form);
      if (res.data.success) {
        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
        navigate("/");
      } else {
        alert(res.data.message || "Kayıt sırasında bir hata oluştu.");
      }
    } catch (err) {
      if (err.response?.data?.message === "duplicate") {
        alert("Bu kullanıcı zaten mevcut.");
      } else {
        alert("Sunucu hatası.");
      }
    } finally {
      setLoading(false); // ✅ Spinner durdur
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h3 className="register-title">Kayıt Ol</h3>
        <form onSubmit={handleSubmit}>
          <input
            className="form-control mb-2"
            name="manager_name"
            placeholder="Ad"
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-2"
            name="manager_surname"
            placeholder="Soyad"
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-2"
            name="manager_username"
            placeholder="Kullanıcı Adı"
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-2"
            name="manager_password"
            type="password"
            placeholder="Şifre"
            onChange={handleChange}
            required
          />
          <input
            className="form-control mb-3"
            name="manager_mail"
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <button className="btn btn-danger w-100" disabled={loading}>
            {loading ? "Yükleniyor..." : "Kayıt Ol"}
          </button>
        </form>
        <p className="mt-3 text-center">
          Zaten üye misiniz? <a href="/">Giriş Yap</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
