import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { register } from "../utils/auth";
import "../styles/register.scss";
import "../styles/modal.scss";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState("");
  const [message, setMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const questionOptions = [
    { value: "1", label: "¿Cuál es el nombre de tu mascota?" },
    { value: "2", label: "¿Cuál es tu ciudad de nacimiento?" },
    { value: "3", label: "¿Cuál es tu comida favorita?" },
    { value: "4", label: "¿Cuál es el nombre de tu mejor amigo de la infancia?" },
  ];

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: "350px",
      margin: "0 auto",
    }),
    control: (provided, state) => ({
      ...provided,
      width: "100%",
      height: "50px",
      padding: "5px",
      display: "flex",
      alignItems: "center",
      borderColor: errors.question ? '#ff3b30' : provided.borderColor,
      '&:hover': {
        borderColor: errors.question ? '#ff3b30' : provided.borderColor,
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      whiteSpace: "normal",
      wordWrap: "break-word",
      overflow: "visible",
    }),
    menu: (provided) => ({
      ...provided,
      width: "350px",
      wordWrap: "break-word",
      margin: "0 auto",
      textAlign: "center",
    }),
  };

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'El nombre es obligatorio';
    }

    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Ingresa un formato de correo válido';
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }

    if (!question) {
      newErrors.question = 'Selecciona una pregunta de seguridad';
    }

    if (!answer.trim()) {
      newErrors.answer = 'La respuesta es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = () => {
    return (
      username.trim() !== '' &&
      email.trim() !== '' &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
      password.trim() !== '' &&
      password.length >= 8 &&
      question !== null &&
      answer.trim() !== ''
    );
  };

  const handleRegister = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = register(username, email, password, question.value, answer);
    setMessage(result.message);
    setIsModalOpen(true);

    if (result.success) {
      setTimeout(() => {
        setIsModalOpen(false);
        navigate("/login");
      }, 3000);
    } else {
      setTimeout(() => {
        setIsModalOpen(false);
      }, 2000);
    }
  };

  const handleFieldChange = (field, value) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }

    switch (field) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'question':
        setQuestion(value);
        break;
      case 'answer':
        setAnswer(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="container">
      <a href="/login" className="back-arrow"></a>
      <h1 className="title">Registrarme</h1>

      <form className="register-form" onSubmit={handleRegister}>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Nombre"
            aria-label="Nombre de usuario"
            className={errors.username ? 'input-error' : ''}
            value={username}
            onChange={(e) => handleFieldChange('username', e.target.value)}
          />
          {errors.username && <span className="error-message">{errors.username}</span>}
        </div>

        <div className="input-wrapper">
          <input
            type="email"
            placeholder="Correo Electrónico"
            aria-label="Correo Electrónico"
            className={errors.email ? 'input-error' : ''}
            value={email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
          />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="input-wrapper">
          <input
            type="password"
            placeholder="Contraseña"
            aria-label="Contraseña"
            className={errors.password ? 'input-error' : ''}
            value={password}
            onChange={(e) => handleFieldChange('password', e.target.value)}
          />
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="input-wrapper">
          <Select
            placeholder="Selecciona una pregunta de seguridad"
            options={questionOptions}
            value={question}
            onChange={(value) => handleFieldChange('question', value)}
            styles={customStyles}
            isSearchable={false}
            aria-label="Pregunta de seguridad"
          />
          {errors.question && <span className="error-message">{errors.question}</span>}
        </div>

        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Respuesta"
            aria-label="Respuesta de seguridad"
            className={errors.answer ? 'input-error' : ''}
            value={answer}
            onChange={(e) => handleFieldChange('answer', e.target.value)}
          />
          {errors.answer && <span className="error-message">{errors.answer}</span>}
        </div>

        <button type="submit" disabled={!isFormValid()}>Registrarme</button>
      </form>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <p>{message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;