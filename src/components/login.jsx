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
  const [error, setError] = useState(''); // texto del error para la modal
  const navigate = useNavigate();

  const handleLogin = async () => {
    // soporta login síncrono o asíncrono
    const result = await Promise.resolve(login(username, password));

    if (result && result.success) {
      navigate('/home');
    } else {
      // mensaje por defecto si no viene result.message
      setError(result?.message || 'Contraseña incorrecta');
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

          {/* Input de contraseña */}
          <div className="input-group">
            <div className="input-line">
              <img src={keyIcon} alt="Key Icon" className="input-icon" />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
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

      {/* Modal de error — se muestra cuando `error` tiene texto */}
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
