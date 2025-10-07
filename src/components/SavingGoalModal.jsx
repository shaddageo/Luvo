import { useState } from 'react';
import '../styles/savingGoalModal.scss';
import { NumericFormat } from 'react-number-format';

const SavingGoalModal = ({ isOpen, onClose, onSave, onDelete, initialData }) => {
    const [name, setName] = useState(initialData?.name || '');
    const [targetAmount, setTargetAmount] = useState(initialData?.targetAmount?.toString() || '');
    const [currentAmount, setCurrentAmount] = useState(initialData?.currentAmount?.toString() || '');
    const [additionalAmount, setAdditionalAmount] = useState('');
    const [targetDate, setTargetDate] = useState(initialData?.targetDate || 'Dic 2025');
    const [isEditing, setIsEditing] = useState(!!initialData);

    const handleAddAmount = () => {
        if (!additionalAmount) return;
        const newCurrentAmount = parseFloat(currentAmount.replace(/\./g, '').replace(',', '.')) + 
                               parseFloat(additionalAmount.replace(/\./g, '').replace(',', '.'));
        setCurrentAmount(newCurrentAmount.toString());
        setAdditionalAmount('');
        
        // Guardar los cambios inmediatamente
        const goal = {
            name,
            targetAmount: parseFloat(targetAmount.replace(/\./g, '').replace(',', '.')),
            currentAmount: newCurrentAmount,
            targetDate,
            percentage: Math.min((newCurrentAmount / parseFloat(targetAmount.replace(/\./g, '').replace(',', '.'))) * 100, 100)
        };
        onSave(goal);
    };
    
    const percentage = targetAmount && currentAmount 
        ? Math.min((parseFloat(currentAmount.replace(/\./g, '').replace(',', '.')) / parseFloat(targetAmount.replace(/\./g, '').replace(',', '.'))) * 100, 100)
        : 0;

    const handleSubmit = (e) => {
        e.preventDefault();
        const goal = {
            name,
            targetAmount: parseFloat(targetAmount.replace(/\./g, '').replace(',', '.')),
            currentAmount: parseFloat(currentAmount.replace(/\./g, '').replace(',', '.')),
            targetDate,
            percentage
        };
        onSave(goal);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {/* Barra de progreso */}
                <div className="progress-bar">
                    <div 
                        className="progress" 
                        style={{ width: `${percentage}%` }}
                    ></div>
                </div>

                <form onSubmit={handleSubmit} className="saving-goal-form">
                    {!isEditing ? (
                        <>
                            {/* Formulario para nueva meta */}
                            <div className="form-group">
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Nombre de la meta"
                                    className="goal-name-input"
                                    required
                                />
                            </div>

                            <div className="amount-section">
                                <NumericFormat
                                    value={currentAmount}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    prefix="$"
                                    placeholder="$0"
                                    onValueChange={(values) => setCurrentAmount(values.value)}
                                    className="amount-input current"
                                    required
                                />
                                <span className="amount-divider">de</span>
                                <NumericFormat
                                    value={targetAmount}
                                    thousandSeparator="."
                                    decimalSeparator=","
                                    prefix="$"
                                    placeholder="$0"
                                    onValueChange={(values) => setTargetAmount(values.value)}
                                    className="amount-input target"
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Vista para editar meta existente */}
                            <h2 className="goal-title">{name}</h2>
                            <div className="current-progress">
                                <span>Progreso actual:</span>
                                <span className="amount-display">
                                    ${new Intl.NumberFormat('es-ES').format(parseFloat(currentAmount))} de ${new Intl.NumberFormat('es-ES').format(parseFloat(targetAmount))}
                                </span>
                            </div>

                            <div className="add-amount-section">
                                <span>Agregar dinero a la meta:</span>
                                <div className="amount-input-group">
                                    <NumericFormat
                                        value={additionalAmount}
                                        thousandSeparator="."
                                        decimalSeparator=","
                                        prefix="$"
                                        placeholder="$0"
                                        onValueChange={(values) => setAdditionalAmount(values.value)}
                                        className="amount-input additional"
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleAddAmount}
                                        className="add-button"
                                        disabled={!additionalAmount}
                                    >
                                        Agregar
                                    </button>
                                </div>
                            </div>

                            {/* Detalles */}
                            <div className="goal-details-grid">
                                <div className="detail-item">
                                    <span className="detail-label">Fecha meta</span>
                                    <span className="detail-value">{targetDate}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Proyección</span>
                                    <span className="detail-value">
                                        {currentAmount ? `$${new Intl.NumberFormat('es-ES').format(parseFloat(currentAmount.replace(/\./g, '').replace(',', '.')))}` : '$0'}
                                    </span>
                                </div>
                                <div className="detail-item">
                                    <span className="detail-label">Falta</span>
                                    <span className="detail-value">
                                        ${new Intl.NumberFormat('es-ES').format(
                                            Math.max(
                                                parseFloat(targetAmount?.replace(/\./g, '').replace(',', '.') || 0) -
                                                parseFloat(currentAmount?.replace(/\./g, '').replace(',', '.') || 0),
                                                0
                                            )
                                        )}
                                    </span>
                                </div>
                            </div>
                        </>
                    )}

                    {/* Botones */}
                    <div className="modal-buttons">
                        <button type="button" onClick={onClose} className="cancel-button">
                            Cancelar
                        </button>
                        {isEditing && (
                            <button 
                                type="button" 
                                onClick={() => {
                                    onDelete();
                                    onClose();
                                }} 
                                className="delete-button"
                            >
                                Eliminar meta
                            </button>
                        )}
                        <button type="submit" className="save-button">
                            {isEditing ? 'Guardar cambios' : 'Crear meta'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SavingGoalModal;