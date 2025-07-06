import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function UserPage() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentManager, setCurrentManager] = useState(null);
  const navigate = useNavigate();

useEffect(() => {
  const token = localStorage.getItem("token");
  const manager = JSON.parse(localStorage.getItem("manager"));
  if (manager) setCurrentManager(manager);

  axios
    .get("http://localhost:5000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => setUsers(res.data))
    .catch((err) => {
      console.error(err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("manager");
        navigate("/"); // logout
      }
    });
}, [navigate]); // ← ✅ BURAYI GÜNCELLEDİK


 const handleDelete = async (id) => {
  const token = localStorage.getItem("token");
  if (!window.confirm("Bu kullanıcı silinsin mi?")) return;

  try {
  await axios.delete(`http://localhost:5000/api/users/${id}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

    // Listeyi güncelle
    setUsers(users.filter((u) => u.MANAGER_ID !== id));

    // Eğer kendi hesabını sildiyse, çıkış yap
    if (currentManager?.MANAGER_ID === id) {
      localStorage.removeItem("token");
      localStorage.removeItem("manager");
      navigate("/");
    }

  } catch (err) {
  console.error("Silme hatası:", err.response?.data || err.message || err);
  alert("Silme başarısız: " + (err.response?.data?.error || err.message));
}
};
  const openEditModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

const handleUpdate = async () => {
  try {
    const response = await axios.put(
      `http://localhost:5000/api/users/${selectedUser.MANAGER_ID}`,
      {
        manager_name: selectedUser.MANAGER_NAME,
        manager_surname: selectedUser.MANAGER_SURNAME,
        manager_username: selectedUser.MANAGER_USERNAME,
        manager_mail: selectedUser.MANAGER_MAIL
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.data.success) {
      alert("Güncelleme başarılı");
      setModalOpen(false);
      setUsers(users.map(u =>
        u.MANAGER_ID === selectedUser.MANAGER_ID ? selectedUser : u
      ));
    }
  } catch (error) {
    console.error("Güncelleme hatası:", error);
    alert("Güncelleme başarısız");
  }
};




  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-2">
         <h5 className="text-muted">
            Hoşgeldin {currentManager?.MANAGER_NAME.toUpperCase()} {currentManager?.MANAGER_SURNAME.toUpperCase()} 👋
          </h5>

        <button
          className="btn btn-danger"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("manager");
            navigate("/");
          }}
        >
          Çıkış Yap
        </button>
      </div>

      <h3 className="mb-3">Kullanıcılar</h3>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Ad</th>
            <th>Soyad</th>
            <th>Kullanıcı Adı</th>
            <th>Email</th>
            <th>İşlemler</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.MANAGER_ID}>
              <td>{user.MANAGER_NAME}</td>
              <td>{user.MANAGER_SURNAME}</td>
              <td>{user.MANAGER_USERNAME}</td>
              <td>{user.MANAGER_MAIL}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => openEditModal(user)}
                >
                  Düzenle
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(user.MANAGER_ID)}
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && selectedUser && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5 className="modal-title">Kullanıcı Güncelle</h5>
              <input className="form-control mb-2" name="MANAGER_NAME" value={selectedUser.MANAGER_NAME} onChange={handleChange} />
              <input className="form-control mb-2" name="MANAGER_SURNAME" value={selectedUser.MANAGER_SURNAME} onChange={handleChange} />
              <input className="form-control mb-2" name="MANAGER_USERNAME" value={selectedUser.MANAGER_USERNAME} onChange={handleChange} />
              <input className="form-control mb-2" name="MANAGER_MAIL" value={selectedUser.MANAGER_MAIL} onChange={handleChange} />
              <div className="d-flex justify-content-end">
                <button className="btn btn-secondary me-2" onClick={() => setModalOpen(false)}>Kapat</button>
                <button className="btn btn-primary" onClick={handleUpdate}>Güncelle</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserPage;
