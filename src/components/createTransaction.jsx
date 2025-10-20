import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { NumericFormat } from "react-number-format";
import Toast from "./Toast";
import "../styles/create.scss";

const CrearTransaccion = () => {
    const navigate = useNavigate();
    const today = new Date().toISOString().split("T")[0];
    const [titulo, setTitulo] = useState("");
    const [monto, setMonto] = useState("");
    const [tipo, setTipo] = useState("");
    const [cuenta, setCuenta] = useState("");
    const [fecha, setFecha] = useState(today);
    const [cuentas, setCuentas] = useState([]);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        const cuentasGuardadas = JSON.parse(localStorage.getItem("cuentas")) || [];
        setCuentas(cuentasGuardadas);
    }, []);

    const isFormValid = () => {
        return (
            titulo.trim() !== '' &&
            monto !== '' &&
            !isNaN(parseFloat(monto)) &&
            parseFloat(monto) > 0 &&
            tipo !== '' &&
            cuenta !== '' &&
            fecha !== ''
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const montoNumerico = parseFloat(monto);
        if (isNaN(montoNumerico) || !titulo.trim() || !tipo || !cuenta || !fecha) {
            setToastMessage("Todos los campos son obligatorios y el monto debe ser válido.");
            setToastType("error");
            setShowToast(true);
            return;
        }

        const mesNombre = new Date(fecha).toLocaleString('es-ES', { month: 'long' }).toLowerCase();
        let transacciones = JSON.parse(localStorage.getItem("transacciones")) || {};
        if (!transacciones[mesNombre]) transacciones[mesNombre] = [];

        transacciones[mesNombre].push({
            titulo: titulo.trim(),
            monto: montoNumerico,
            tipo,
            cuenta,
            fecha
        });
        localStorage.setItem("transacciones", JSON.stringify(transacciones));

        window.dispatchEvent(new Event('transaccionesChanged'));
        window.dispatchEvent(new Event('storage'));

        console.log("✅ Transacción guardada y eventos emitidos");

        // Mostrar toast de éxito
        setToastMessage("Transacción guardada con éxito");
        setToastType("success");
        setShowToast(true);

        // Navegar de vuelta a la página anterior después de mostrar el toast
        setTimeout(() => {
            navigate(-1);
        }, 1500);
    };

    return (
        <div className="container">
            <h1 className="title">Agregar Transacción</h1>
            <form id="transactionForm" className="account-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />
                <NumericFormat
                    value={monto}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale={true}
                    allowNegative={false}
                    placeholder="Monto"
                    onValueChange={({ value }) => setMonto(value)}
                    className="input-field"
                />
                <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                    <option value="" disabled>Tipo de movimiento</option>
                    <option value="ingreso">Ingreso</option>
                    <option value="gasto">Gasto</option>
                </select>
                <select value={cuenta} onChange={(e) => setCuenta(e.target.value)}>
                    <option value="" disabled>Cuenta</option>
                    {cuentas.map((c, index) => (
                        <option key={index} value={c.nombre}>{c.nombre}</option>
                    ))}
                </select>
                <input
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                />
                <button type="submit" disabled={!isFormValid()}>Guardar</button>
                <button type="button" className="submit-btn" onClick={() => navigate('/home')}>Volver</button>
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

export default CrearTransaccion;