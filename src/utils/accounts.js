// Función para obtener las cuentas del localStorage
export const obtenerCuentas = () => {
    try {
        const cuentasString = localStorage.getItem('cuentas');
        if (!cuentasString) return [];
        return JSON.parse(cuentasString);
    } catch (error) {
        console.error('Error al obtener cuentas:', error);
        return [];
    }
};

// Función para guardar las cuentas en localStorage
export const guardarCuentas = (cuentas) => {
    try {
        localStorage.setItem('cuentas', JSON.stringify(cuentas));
        // Disparar evento de actualización
        window.dispatchEvent(new Event('cuentasChanged'));
    } catch (error) {
        console.error('Error al guardar cuentas:', error);
    }
};

// Función para actualizar el saldo de una cuenta
export const actualizarSaldoCuenta = (nombreCuenta, nuevoSaldo) => {
    try {
        const cuentas = obtenerCuentas();
        const cuentaIndex = cuentas.findIndex(c => c.nombre.trim().toLowerCase() === nombreCuenta.trim().toLowerCase());
        
        if (cuentaIndex >= 0) {
            cuentas[cuentaIndex].saldo = nuevoSaldo;
            guardarCuentas(cuentas);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al actualizar saldo:', error);
        return false;
    }
};

// Función para obtener el saldo actual de una cuenta
export const obtenerSaldoCuenta = (nombreCuenta) => {
    try {
        const cuentas = obtenerCuentas();
        const cuenta = cuentas.find(c => c.nombre.trim().toLowerCase() === nombreCuenta.trim().toLowerCase());
        return cuenta ? cuenta.saldo : 0;
    } catch (error) {
        console.error('Error al obtener saldo:', error);
        return 0;
    }
};