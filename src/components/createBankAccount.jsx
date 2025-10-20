import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { agregarCuenta } from "../utils/createAccount";
import { NumericFormat } from "react-number-format";
import Toast from "./Toast";
import "../styles/create.scss";
import "../styles/modal.scss";

const CrearCuentaBancaria = () => {
  const navigate = useNavigate();
  const [nombreCuenta, setNombreCuenta] = useState("");
  const [saldoInicial, setSaldoInicial] = useState();
  const [tipoCuenta, setTipoCuenta] = useState("");
  const [colorCuenta, setColorCuenta] = useState("#9B02F4");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);

  const isFormValid = () => {
    return (
      nombreCuenta.trim() !== '' &&
      saldoInicial !== undefined &&
      saldoInicial >= 0 &&
      tipoCuenta !== ''
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("handleSubmit invoked");
    console.log("Nombre cuenta:", nombreCuenta);
    console.log("Saldo inicial:", saldoInicial);
    console.log("Tipo cuenta:", tipoCuenta);
    console.log("Color cuenta:", colorCuenta);

    if (!nombreCuenta || saldoInicial === undefined || saldoInicial < 0 || !tipoCuenta) {
      showToastMessage("Por favor, completa todos los campos correctamente.", "error");
      console.log("Validation failed: Faltan datos o saldo incorrecto");
      return;
    }

    const nuevaCuenta = {
      nombre: nombreCuenta,
      saldo: saldoInicial,
      tipo: tipoCuenta,
      color: colorCuenta,
    };

    const resultado = agregarCuenta(nuevaCuenta);

    if (resultado.error) {
      showToastMessage(resultado.error, "error");
      console.log("Error al agregar cuenta:", resultado.error);
      return;
    }

    window.dispatchEvent(new Event('cuentasChanged'));
    window.dispatchEvent(new Event('storage'));
    console.log("✅ Cuenta agregada y eventos emitidos");
    
    showToastMessage("Cuenta creada con éxito", "success");
    
    // Redirigir después de mostrar el toast
    setTimeout(() => {
      navigate("/home");
      console.log("Redirecting to /home");
    }, 2000);
  };

  const showToastMessage = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    console.log("Toast shown with message:", message);
  };

  const handleFieldChange = (field, value) => {
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }

    switch (field) {
      case 'nombreCuenta':
        setNombreCuenta(value);
        break;
      case 'saldoInicial':
        setSaldoInicial(value);
        break;
      case 'tipoCuenta':
        setTipoCuenta(value);
        break;
      case 'colorCuenta':
        setColorCuenta(value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="container">
      <h1 className="title">Crear Cuenta Bancaria</h1>
      <form className="account-form" onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Nombre de la cuenta"
            className={errors.nombreCuenta ? 'input-error' : ''}
            value={nombreCuenta}
            onChange={(e) => handleFieldChange('nombreCuenta', e.target.value)}
          />
          {errors.nombreCuenta && <span className="error-message">{errors.nombreCuenta}</span>}
        </div>

        <div className="input-wrapper">
          <NumericFormat
            value={saldoInicial}
            thousandSeparator="."
            decimalSeparator=","
            decimalScale={2}
            fixedDecimalScale={true}
            allowNegative={false}
            placeholder="Saldo inicial"
            onValueChange={({ floatValue }) => handleFieldChange('saldoInicial', floatValue)}
            className={`input-field ${errors.saldoInicial ? 'input-error' : ''}`}
          />
          {errors.saldoInicial && <span className="error-message">{errors.saldoInicial}</span>}
        </div>

        <div className="input-wrapper">
          <select
            value={tipoCuenta}
            onChange={(e) => handleFieldChange('tipoCuenta', e.target.value)}
            className={errors.tipoCuenta ? 'input-error' : ''}
          >
            <option value="" disabled>
              Selecciona el tipo de cuenta
            </option>
            <option value="ahorros">Ahorros</option>
            <option value="corriente">Corriente</option>
            <option value="efectivo">Efectivo</option>
            <option value="otro">Otro</option>
          </select>
          {errors.tipoCuenta && <span className="error-message">{errors.tipoCuenta}</span>}
        </div>

        <div className="color-selector-container">
          <label>Color de la cuenta:</label>
          <div className="color-options">
            {["#9B02F4", "#F2FF00", "#FF2727", "#122757", "#005C53", "#011F26"].map(
              (color) => (
                <div
                  key={color}
                  className={`color-option ${color === colorCuenta ? "selected" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => handleFieldChange('colorCuenta', color)}
                ></div>
              )
            )}
          </div>
        </div>

        <button type="submit" disabled={!isFormValid()}>Crear Cuenta</button>
        <button type="button" className="submit-btn" onClick={() => navigate('/home')}>
          Volver
        </button>
      </form>
      <Toast 
        message={toastMessage} 
        type={toastType}
        isVisible={showToast} 
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default CrearCuentaBancaria;