import React, { useState, useEffect } from 'react';
import './CustomDialog.css';

const CustomDialog = ({ type, message, defaultValue, onResolve, onClose }) => {
  const [inputValue, setInputValue] = useState(defaultValue || '');
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Enter' && type !== 'alert') handleConfirm();
      if (e.key === 'Enter' && type === 'alert') {
        onResolve(true);
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputValue]);

  const handleConfirm = () => {
    if (type === 'prompt') {
      onResolve(inputValue);
    } else {
      onResolve(true);
    }
    onClose();
  };

  const handleCancel = () => {
    onResolve(type === 'prompt' ? null : false);
    onClose();
  };

  return (
    <div className="custom-dialog-overlay" onClick={handleCancel}>
      <div className="custom-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="custom-dialog-header">
          <i className={`fa-solid ${type === 'alert' ? 'fa-circle-exclamation' : type === 'confirm' ? 'fa-circle-question' : 'fa-pen-to-square'}`}></i>
          <h3>{type === 'alert' ? 'Atención' : type === 'confirm' ? 'Confirmación' : 'Entrada requerida'}</h3>
        </div>
        <div className="custom-dialog-body">
          <p>{message}</p>
          {type === 'prompt' && (
            <input 
              type="text" 
              value={inputValue} 
              onChange={(e) => setInputValue(e.target.value)}
              autoFocus 
            />
          )}
        </div>
        <div className="custom-dialog-footer">
          {type !== 'alert' && (
            <button className="btn-cancel" onClick={handleCancel}>Cancelar</button>
          )}
          <button className="btn-confirm" onClick={handleConfirm}>
            {type === 'alert' ? 'Entendido' : 'Aceptar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomDialog;
