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
  const [saldoInicial, setSaldoInicial] = useState(); // Almacena el valor numérico real
  const [tipoCuenta, setTipoCuenta] = useState("");
  const [colorCuenta, setColorCuenta] = useState("#9B02F4");
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [showToast, setShowToast] = useState(false);

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

    console.log("Nueva cuenta a agregar:", nuevaCuenta);
    const resultado = agregarCuenta(nuevaCuenta);
    console.log("Resultado de agregarCuenta:", resultado);

    // Mostrar en consola los datos guardados en localStorage
    const cuentasGuardadas = JSON.parse(localStorage.getItem("cuentas"));
    console.log("Cuentas en localStorage:", cuentasGuardadas);

    if (resultado.error) {
      showToastMessage(resultado.error, "error");
      console.log("Error al agregar cuenta:", resultado.error);
      return;
    }
    
    // ✅ NUEVO - Emitir eventos de actualización
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

  return (
    <div className="container">
      <h1 className="title">Crear Cuenta Bancaria</h1>
      <form className="account-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nombre de la cuenta"
          value={nombreCuenta}
          onChange={(e) => {
            setNombreCuenta(e.target.value);
            console.log("Nombre cuenta changed:", e.target.value);
          }}
          required
        />
        <NumericFormat
          value={saldoInicial}
          thousandSeparator="."
          decimalSeparator=","
          decimalScale={2}
          fixedDecimalScale={true}
          allowNegative={false}
          placeholder="Saldo inicial"
          onValueChange={({ floatValue }) => {
            setSaldoInicial(floatValue);
            console.log("Saldo inicial changed (floatValue):", floatValue);
          }}
          required
          className="input-field"
        />
        <select
          value={tipoCuenta}
          onChange={(e) => {
            setTipoCuenta(e.target.value);
            console.log("Tipo cuenta changed:", e.target.value);
          }}
          required
        >
          <option value="" disabled>
            Selecciona el tipo de cuenta
          </option>
          <option value="ahorros">Ahorros</option>
          <option value="corriente">Corriente</option>
          <option value="efectivo">Efectivo</option>
          <option value="otro">Otro</option>
        </select>
        <div className="color-selector-container">
          <label>Color de la cuenta:</label>
          <div className="color-options">
            {["#9B02F4", "#F2FF00", "#FF2727", "#122757", "#005C53", "#011F26"].map(
              (color) => (
                <div
                  key={color}
                  className={`color-option ${color === colorCuenta ? "selected" : ""}`}
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    setColorCuenta(color);
                    console.log("Color cuenta selected:", color);
                  }}
                ></div>
              )
            )}
          </div>
        </div>
        <button type="submit">Crear Cuenta</button>
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