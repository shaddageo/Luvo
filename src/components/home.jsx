import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { obtenerCuentas } from "../utils/createAccount";
import { generateChart } from "../utils/generateChart";
import "../styles/home.scss";
import "../main.scss";
import plusIcon from "../assets/plus.svg";
import Header from "../components/Header";

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Usuario");
  const [greeting, setGreeting] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [savingGoal, setSavingGoal] = useState(() => {
    const saved = localStorage.getItem('savingGoal');
    return saved ? JSON.parse(saved) : null;
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const chartRef = useRef(null);

  // Carga las cuentas desde localStorage y recalcula el saldo basado en las transacciones
  const loadAccounts = useCallback(() => {
    console.log("Ejecutando loadAccounts...");
    const cuentas = obtenerCuentas() || [];
    console.log("Cuentas obtenidas:", cuentas);

    const transaccionesStorage =
      JSON.parse(localStorage.getItem("transacciones")) || {};
    console.log("Transacciones obtenidas:", transaccionesStorage);

    const cuentasActualizadas = cuentas.map(acct => {
      // Inicia con el saldo almacenado en la cuenta
      let total = acct.saldo || 0;
      console.log(`Cuenta ${acct.nombre} - Saldo inicial:`, total);

      Object.keys(transaccionesStorage).forEach(key => {
        const transaccionesMes = transaccionesStorage[key] || [];
        transaccionesMes.forEach(t => {
          if (
            t.cuenta.trim().toLowerCase() ===
            acct.nombre.trim().toLowerCase()
          ) {
            const montoTransaccion = t.tipo === "ingreso" ? t.monto : -t.monto;
            total += montoTransaccion;
            console.log(
              `Cuenta ${acct.nombre}: Se ${t.tipo === "ingreso" ? "suma" : "resta"} ${t.monto} (Total actual: ${total})`
            );
          }
        });
      });
      return { ...acct, saldo: total };
    });

    console.log("Cuentas actualizadas:", cuentasActualizadas);
    setAccounts(cuentasActualizadas);

    const totalBalanceCalculado = cuentasActualizadas.reduce(
      (sum, cuenta) => sum + (cuenta.saldo || 0),
      0
    );
    console.log("Total Balance Calculado:", totalBalanceCalculado);
    setTotalBalance(totalBalanceCalculado);
  }, []);

  // Configura el saludo del usuario y carga las cuentas al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem("user") || "Usuario";
    setUsername(storedUser);
    console.log("Usuario obtenido:", storedUser);

    const hour = new Date().getHours();
    const saludo =
      hour < 12 ? "Buenos días" : hour < 18 ? "Buenas tardes" : "Buenas noches";
    setGreeting(saludo);
    console.log("Saludo configurado:", saludo);

    loadAccounts();
    
    // Cargar transacciones recientes
    const transaccionesStorage = JSON.parse(localStorage.getItem("transacciones")) || {};
    const todasLasTransacciones = [];
    
    Object.values(transaccionesStorage).forEach(transaccionesMes => {
      transaccionesMes.forEach(t => {
        todasLasTransacciones.push({
          ...t,
          fecha: new Date(t.fecha)
        });
      });
    });
    
    // Ordenar por fecha más reciente
    todasLasTransacciones.sort((a, b) => b.fecha - a.fecha);
    setRecentTransactions(todasLasTransacciones);
  }, [loadAccounts]);

  // Escucha eventos de cambios en cuentas o transacciones para actualizar los datos
  useEffect(() => {
    const handleDataChange = () => {
      console.log("Evento cuentasChanged/transaccionesChanged capturado.");
      loadAccounts();
    };
    const handleStorageChange = (event) => {
      console.log("Evento storage capturado:", event.key);
      if (event.key === "cuentas" || event.key === "transacciones") {
        loadAccounts();
      }
    };

    window.addEventListener("cuentasChanged", handleDataChange);
    window.addEventListener("transaccionesChanged", handleDataChange);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("cuentasChanged", handleDataChange);
      window.removeEventListener("transaccionesChanged", handleDataChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [loadAccounts]);

  // Genera o actualiza el gráfico cuando las cuentas cambian
  useEffect(() => {
    if (chartRef.current && accounts.length > 0) {
      console.log("Generando gráfico con cuentas:", accounts);
      generateChart(chartRef.current, accounts);
    }
  }, [accounts]);

  // Formatea los valores numéricos a un formato de moneda legible
  const formatNumber = (value) =>
    new Intl.NumberFormat("es-ES", {
      style: "decimal",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <>
      <div className="inicio-container" style={{
        height: '100vh',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        WebkitOverflowScrolling: 'touch',
        backgroundColor: '#fff',
        padding: 'var(--page-padding)',
        paddingBottom: 'calc(80px + env(safe-area-inset-bottom))',
        width: '100%',
        maxWidth: '100%'
      }}>
        <Header />
        <h1 className="page-title" id="welcomeUser">
          {greeting}, {username}
        </h1>

        <div className="grid-container" id="cuentasContainer">
          {accounts.length > 0 ? (
            accounts.map((cuenta, index) => (
              <div
                key={index}
                className="grid-item"
                onClick={() => navigate(`/account/${cuenta.nombre}`)}
                style={{ "--account-color": cuenta.color }}
              >
                <p className="item-title">{cuenta.nombre}</p>
                <p className="item-amount">${formatNumber(cuenta.saldo)}</p>
              </div>
            ))
          ) : (
            <div className="empty-accounts">
              <p>No hay cuentas creadas.</p>
            </div>
          )}
        </div>

        {accounts.length < 4 && (
          <div
            className="grid-item-agregar"
            onClick={() => navigate("/createaccount")}
          >
            <p className="item-title">Agregar</p>
            <img src={plusIcon} alt="Agregar" className="plus-icon" />
          </div>
        )}

        <h2 className="section-title">Saldo Total</h2>
        <div className="budget-container">
          <div className="budget-box">
            <p className="budget-total" id="totalDinero">
              ${formatNumber(totalBalance)}
            </p>
          </div>
        </div>

        <h2 className="section-title">Tu meta de ahorro</h2>
        {savingGoal ? (
          <div className="saving-goal-container">
            <div className="saving-goal-info">
              <div className="goal-details">
                <span>Fecha meta: {savingGoal.targetDate}</span>
                <span>Proyección: {formatNumber(savingGoal.currentAmount)}</span>
                <span>Falta: ${formatNumber(savingGoal.targetAmount - savingGoal.currentAmount)}</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress" 
                  style={{
                    width: `${Math.min((savingGoal.currentAmount / savingGoal.targetAmount) * 100, 100)}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="create-goal-button" onClick={() => navigate('/create-goal')}>
            Crear meta →
          </div>
        )}

        <h2 className="section-title">Transacciones Recientes</h2>
        <div className="recent-transactions">
          {accounts.length > 0 ? (
            recentTransactions.slice(0, 4).map((transaction, index) => (
              <div key={index} className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-date">
                    {new Date(transaction.fecha).toLocaleDateString('es-ES', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  <span className="transaction-account">{transaction.cuenta}</span>
                </div>
                <span className={`transaction-amount ${transaction.tipo}`}>
                  {transaction.tipo === 'gasto' ? '-' : '+'}${formatNumber(transaction.monto)}
                </span>
              </div>
            ))
          ) : (
            <p className="no-transactions">No hay transacciones recientes</p>
          )}
          {recentTransactions.length > 0 && (
            <button className="view-all-button" onClick={() => navigate('/transactions')}>
              Ver todas →
            </button>
          )}
        </div>

        <h2 className="section-title-2">Gráfico Histórico</h2>
        <div className="chart-container">
          {accounts.length > 0 ? (
            <canvas ref={chartRef} id="budgetChart"></canvas>
          ) : (
            <p className="empty-chart-message">
              Agrega al menos una cuenta bancaria <br />para visualizar el gráfico.
            </p>
          )}
        </div>
      </div>
      <Navbar />
    </>
  );
};

export default Home;
