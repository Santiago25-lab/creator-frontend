import React from 'react';
import { createRoot } from 'react-dom/client';
import CustomDialog from '../components/CustomDialog';

const renderDialog = (type, message, defaultValue = '') => {
  return new Promise((resolve) => {
    const dialogContainer = document.createElement('div');
    document.body.appendChild(dialogContainer);
    const root = createRoot(dialogContainer);

    const handleResolve = (value) => {
      resolve(value);
    };

    const handleClose = () => {
      setTimeout(() => {
        root.unmount();
        if (dialogContainer.parentNode) {
          dialogContainer.parentNode.removeChild(dialogContainer);
        }
      }, 0);
    };

    root.render(
      <CustomDialog
        type={type}
        message={message}
        defaultValue={defaultValue}
        onResolve={handleResolve}
        onClose={handleClose}
      />
    );
  });
};

export const customAlert = (message) => renderDialog('alert', message);
export const customConfirm = (message) => renderDialog('confirm', message);
export const customPrompt = (message, defaultValue = '') => renderDialog('prompt', message, defaultValue);
