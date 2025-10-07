import { Link, useNavigate } from "react-router-dom";
import "/src/styles/navbar.scss"; // Asegúrate de que el archivo de estilos existe

// Importación de íconos
import houseIcon from "/src/assets/house.svg";
import moneyIcon from "/src/assets/money.svg";
import pointsIcon from "/src/assets/points.svg";
import plusIcon from "/src/assets/plus.svg";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <>
            {/* Botón flotante */}
            <div className="floating-button" onClick={() => navigate("/createTransaction")}>
                <img src={plusIcon} alt="+" className="icon" />
            </div>

            {/* Barra de navegación */}
            <nav className="navbar">
                <div 
                    className="nav-item" 
                    onClick={() => {
                        const currentPath = window.location.pathname;
                        if (currentPath !== "/home") {
                            navigate("/home");
                        }
                    }}
                >
                    <img src={houseIcon} alt="Inicio" />
                    <span>Inicio</span>
                </div>
                <Link to="/transactions" className="nav-item">
                    <img src={moneyIcon} alt="Transacciones" />
                    <span>Transacciones</span>
                </Link>
                <Link to="/account" className="nav-item">
                    <img src={pointsIcon} alt="Más" />
                    <span>Más</span>
                </Link>
            </nav>
        </>
    );
};

export default Navbar;
