import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updatePassword } from "../utils/auth";
import "../styles/forgotPassword.scss";
import "../styles/modal.scss";
import lockIcon from "../assets/lock.svg";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const username = localStorage.getItem("resetUser");

  useEffect(() => {
    if (!username) {
      navigate("/forgot-password");
    }
  }, [username, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password.length < 8) {
      setModalMessage("La contraseña debe tener al menos 8 caracteres.");
      setIsModalOpen(true);
      setTimeout(() => setIsModalOpen(false), 2500);
      return;
    }

    if (password !== confirmPassword) {
      setModalMessage("Las contraseñas no coinciden.");
      setIsModalOpen(true);
      setTimeout(() => setIsModalOpen(false), 2500);
      return;
    }

    try {
      const result = await Promise.resolve(updatePassword(username, password));

      setModalMessage(
        result.success
          ? "Contraseña restablecida con éxito. Serás redirigido al login."
          : result.message || "Error al restablecer contraseña."
      );
      setIsModalOpen(true);

      if (result.success) {
        localStorage.removeItem("resetUser");

        // 🔥 Esperamos 2.5 segundos y luego redirigimos
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2500);
      } else {
        // Si falla, cerramos modal luego de 2.5 s
        setTimeout(() => setIsModalOpen(false), 2500);
      }
    } catch (err) {
      console.error("updatePassword error:", err);
      setModalMessage("Ocurrió un error inesperado.");
      setIsModalOpen(true);
      setTimeout(() => setIsModalOpen(false), 2500);
    }
  };

  return (
    <div className="form-container">
      <a href="/login" className="back-arrow"></a>
      <h1 className="title">Restablecer Contraseña</h1>

      <form onSubmit={handleSubmit} className="forgot-password-form">
        <div className="input-group">
          <label className="input-label">Nueva Contraseña</label>
          <div className="input-line">
            <img src={lockIcon} alt="Icono de candado" className="input-icon" />
            <input
              type="password"
              placeholder="Ingresa tu nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="input-group">
          <label className="input-label">Confirmar Contraseña</label>
          <div className="input-line">
            <img src={lockIcon} alt="Icono de candado" className="input-icon" />
            <input
              type="password"
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="button-group">
          <button type="submit" className="btn btn-primary">
            Restablecer
          </button>
        </div>
      </form>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>{modalMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResetPassword;
