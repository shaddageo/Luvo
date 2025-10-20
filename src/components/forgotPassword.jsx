import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSecurityQuestion, validateSecurityAnswer } from "../utils/auth";
import "../styles/forgotPassword.scss";

import userIcon from "../assets/user.svg";
import questionIcon from "../assets/question.svg";

function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const isStep1Valid = () => username.trim() !== '';
  const isStep2Valid = () => answer.trim() !== '';

  const handleUserSubmit = (e) => {
    e.preventDefault();
    const retrievedQuestion = getSecurityQuestion(username);

    if (retrievedQuestion) {
      setQuestion(retrievedQuestion);
      setStep(2);
    } else {
      setModalMessage("Usuario no encontrado");
      setIsModalOpen(true);
    }
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (validateSecurityAnswer(username, answer)) {
      setModalMessage("Respuesta correcta.");
      setIsModalOpen(true);

      localStorage.setItem("resetUser", username);

      setTimeout(() => {
        setIsModalOpen(false);
        navigate("/resetpassword");
      }, 1000);
    } else {
      setModalMessage("Respuesta incorrecta. Inténtalo de nuevo.");
      setIsModalOpen(true);
    }
  };

  return (
    <div className="form-container">
      <a href="/login" className="back-arrow"></a>
      <h1 className="title">¿Olvidaste tu contraseña?</h1>

      {step === 1 ? (
        <form className="forgot-password-form" onSubmit={handleUserSubmit}>
          <p>Coloca tu usuario</p>
          <div className="input-group">
            <div className="input-line">
              <img src={userIcon} alt="User Icon" className="input-icon" />
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isStep1Valid()}
          >
            Enviar
          </button>
        </form>
      ) : (
        <form className="forgot-password-form" onSubmit={handleAnswerSubmit}>
          <p>Responde la pregunta de seguridad</p>
          <h3>{question}</h3>
          <div className="input-group">
            <div className="input-line">
              <img src={questionIcon} alt="Question Icon" className="input-icon" />
              <input
                type="text"
                placeholder="Ingresa tu respuesta"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isStep2Valid()}
          >
            Verificar
          </button>
        </form>
      )}

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>{modalMessage}</p>
            {modalMessage !== "Respuesta correcta." && (
              <button onClick={() => setIsModalOpen(false)}>Cerrar</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ForgotPassword;