import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { obtenerCuentas } from "../utils/createAccount";
import { generateChart } from "../utils/generateChart";
import "../styles/home.scss";
import "../styles/savingGoal.scss";
import "../main.scss";
import plusIcon from "../assets/plus.svg";
import Header from "../components/Header";
import SavingGoalModal from "./SavingGoalModal";

const Home = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("Usuario");
  const [greeting, setGreeting] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingGoal, setSavingGoal] = useState(() => {
    const saved = localStorage.getItem('savingGoal');
    return saved ? JSON.parse(saved) : null;
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const chartRef = useRef(null);

  // Carga las cuentas y transacciones desde localStorage y actualiza los estados
  const loadAccounts = useCallback(() => {
    console.log("Ejecutando loadAccounts...");
    const cuentas = obtenerCuentas() || [];
    console.log("Cuentas obtenidas:", cuentas);

    const transaccionesStorage =
      JSON.parse(localStorage.getItem("transacciones")) || {};
    console.log("Transacciones obtenidas:", transaccionesStorage);

    // Actualizar transacciones recientes
    const todasLasTransacciones = [];
    Object.values(transaccionesStorage).forEach(transaccionesMes => {
      transaccionesMes.forEach(t => {
        todasLasTransacciones.push({
          ...t,
          fecha: new Date(t.fecha)
        });
      });
    });
    todasLasTransacciones.sort((a, b) => b.fecha - a.fecha);
    setRecentTransactions(todasLasTransacciones);

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
  }, [loadAccounts]);

  // Escucha eventos de cambios en cuentas o transacciones para actualizar los datos
  useEffect(() => {
    const handleDataChange = () => {
      console.log("Evento cuentasChanged/transaccionesChanged capturado.");
      loadAccounts();
    };

    // Esta función manejará cualquier cambio en las transacciones
    const handleTransactionChange = () => {
      console.log("Cambio en transacciones detectado");
      requestAnimationFrame(() => {
        loadAccounts();
      });
    };

    window.addEventListener("cuentasChanged", handleDataChange);
    window.addEventListener("transaccionesChanged", handleTransactionChange);

    // Forzar una actualización inicial
    handleTransactionChange();

    return () => {
      window.addEventListener("cuentasChanged", handleDataChange);
      window.addEventListener("transaccionesChanged", handleTransactionChange);
    };
  }, [loadAccounts]);

  // Genera o actualiza el gráfico cuando las cuentas cambian
  useEffect(() => {
    if (chartRef.current && accounts.length > 0) {
      console.log("Generando gráfico con cuentas:", accounts);
      generateChart(chartRef.current, accounts);
    }
  }, [accounts]);

  // Formatea números grandes en formato compacto (k, M)
  const formatLargeNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 100000) {
      return `${(value / 1000).toFixed(1)}k`;
    }
    return new Intl.NumberFormat("es-ES", {
      style: "decimal",
      minimumFractionDigits: 2,
    }).format(value);
  };

  // Formatea los valores numéricos a un formato de moneda legible
  const formatNumber = (value) =>
    new Intl.NumberFormat("es-ES", {
      style: "decimal",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <>
      <div className="inicio-container">
        <Header />
        <h1 className="page-title" id="welcomeUser">
          {greeting}, {username}
        </h1>

        <div className="summary-container">
          <div className="summary-item">
            <span className="summary-label">Saldo Total</span>
            <span className="summary-value">${formatLargeNumber(totalBalance)}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Ingresos</span>
            <span className="summary-value positive">${formatLargeNumber(recentTransactions
              .filter(t => {
                const transDate = new Date(t.fecha);
                const now = new Date();
                return transDate.getMonth() === now.getMonth() && transDate.getFullYear() === now.getFullYear() && t.tipo === "ingreso";
              })
              .reduce((sum, t) => sum + t.monto, 0))}</span>
            <span className="summary-period">{new Date().toLocaleString('es-ES', { month: 'long' })} {new Date().getFullYear()}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">Gastos</span>
            <span className="summary-value negative">${formatLargeNumber(recentTransactions
              .filter(t => {
                const transDate = new Date(t.fecha);
                const now = new Date();
                return transDate.getMonth() === now.getMonth() && transDate.getFullYear() === now.getFullYear() && t.tipo === "gasto";
              })
              .reduce((sum, t) => sum + t.monto, 0))}</span>
            <span className="summary-period">{new Date().toLocaleString('es-ES', { month: 'long' })} {new Date().getFullYear()}</span>
          </div>
        </div>

        <h2 className="section-title">Mis cuentas</h2>
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

        <div className="section-header">
          <h2 className="section-title">Tu meta de ahorro</h2>
          <div className="create-goal-button" onClick={() => setIsModalOpen(true)}>
            Crear meta →
          </div>
        </div>
        {savingGoal ? (
          <div 
            className="saving-goal-container"
            onClick={() => setIsModalOpen(true)}
          >
            <div className="saving-goal-info">
              <div className="goal-details">
                <span>{savingGoal.name}</span>
                <span>${formatNumber(savingGoal.currentAmount)} de ${formatNumber(savingGoal.targetAmount)}</span>
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{
                      width: `${Math.min((savingGoal.currentAmount / savingGoal.targetAmount) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
              <div className="meta-info">
                <div className="info-block">
                  <span>Fecha meta</span>
                  <span>Dic 2025</span>
                </div>
                <div className="info-block">
                  <span>Proyección</span>
                  <span>Adelantado según plan</span>
                </div>
                <div className="info-block">
                  <span>Falta</span>
                  <span>${formatNumber(savingGoal.targetAmount - savingGoal.currentAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <SavingGoalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initialData={savingGoal}
          onSave={(goal) => {
            setSavingGoal(goal);
            localStorage.setItem('savingGoal', JSON.stringify(goal));
          }}
          onDelete={() => {
            setSavingGoal(null);
            localStorage.removeItem('savingGoal');
          }}
        />
        <h2 className="section-title">Transacciones Recientes</h2>
        <div className="recent-transactions">
          {accounts.length > 0 ? (
            <>
              {recentTransactions.slice(0, 4).map((transaction, index) => (
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
              ))}
              {recentTransactions.length > 0 && (
                <div className="view-all-button-container">
                  <button
                    className="view-all-button"
                    onClick={() => navigate('/transactions')}
                  >
                    Ver todas →
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="no-transactions">No hay transacciones recientes</p>
          )}
        </div>        <h2 className="section-title-2">Gráfico Histórico</h2>
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
