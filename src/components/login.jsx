import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.scss';
import '../styles/modal.scss';
import { login } from '../utils/auth';

import logo from '../assets/logo.svg';
import userIcon from '../assets/user.svg';
import keyIcon from '../assets/key.svg';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'El usuario es obligatorio';
    }

    if (!password.trim()) {
      newErrors.password = 'La contraseña es obligatoria';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    const result = await Promise.resolve(login(username, password));

    if (result && result.success) {
      navigate('/home');
    } else {
      setError(result?.message || 'Contraseña incorrecta');
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (errors.username) {
      setErrors({ ...errors, username: '' });
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: '' });
    }
  };

  return (
    <div className="login-page">
      <div className="form-container">
        <div className="logo-container">
          <img src={logo} alt="Logo" />
        </div>

        <div className="form-content">
          {/* Input de usuario */}
          <div className="input-group">
            <div className={`input-line ${errors.username ? 'error' : ''}`}>
              <img src={userIcon} alt="User Icon" className="input-icon" />
              <input
                type="text"
                placeholder="Usuario"
                value={username}
                onChange={handleUsernameChange}
              />
            </div>
            {errors.username && <span className="error-message">{errors.username}</span>}
          </div>

          {/* Input de contraseña */}
          <div className="input-group">
            <div className={`input-line ${errors.password ? 'error' : ''}`}>
              <img src={keyIcon} alt="Key Icon" className="input-icon" />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
              />
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
            <span
              className="forgot-password"
              onClick={() => navigate('/ForgotPassword')}
            >
              Restablecer tu contraseña
            </span>
          </div>

          {/* Botones */}
          <div className="button-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleLogin}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/register')}
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>

      {/* Modal de error */}
      {error && (
        <div className="modal" role="dialog" aria-modal="true">
          <div className="modal-content">
            <p>{error}</p>
            <div className="modal-buttons">
              <button
                className="cancel-button"
                onClick={() => setError('')}
                autoFocus
              >
                Vale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;