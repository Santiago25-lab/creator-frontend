import React, { useState } from 'react';

const EditableText = ({ initialText, initialSize, style = {}, isEditMode }) => {
  const [fontSize, setFontSize] = useState(initialSize || 16);
  const [isFocused, setIsFocused] = useState(false);

  const containerStyle = {
    position: 'relative',
    display: 'inline-block',
    width: '100%',
    ...style,
    fontSize: `${fontSize}px`,
    outline: isEditMode && isFocused ? '2px solid #3498db' : (isEditMode ? '1px dashed rgba(52, 152, 219, 0.3)' : 'none'),
    padding: isEditMode ? '2px' : '0',
    transition: 'outline 0.2s',
  };

  const toolbarStyle = {
    position: 'absolute',
    top: '-35px',
    left: '0',
    background: '#3498db',
    borderRadius: '4px',
    display: isEditMode && isFocused ? 'flex' : 'none',
    gap: '5px',
    padding: '4px',
    zIndex: 1000,
    boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
  };

  const btnStyle = {
    background: 'white',
    border: 'none',
    borderRadius: '3px',
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#3498db'
  };

  return (
    <div 
      style={containerStyle}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setTimeout(() => setIsFocused(false), 200)}
    >
      {isEditMode && (
        <div style={toolbarStyle}>
          <button style={btnStyle} onClick={() => setFontSize(prev => Math.max(8, prev - 2))}>-</button>
          <span style={{ color: 'white', fontSize: '12px', padding: '0 5px', alignSelf: 'center' }}>{fontSize}px</span>
          <button style={btnStyle} onClick={() => setFontSize(prev => Math.min(100, prev + 2))}>+</button>
        </div>
      )}
      {/* 
        IMPORTANTE: no mezclar contentEditable con children de React.
        Usar dangerouslySetInnerHTML en modo edición para evitar el crash removeChild.
      */}
      {isEditMode ? (
        <div
          contentEditable={true}
          suppressContentEditableWarning={true}
          style={{ outline: 'none', minHeight: '1em' }}
          dangerouslySetInnerHTML={{ __html: initialText || '' }}
        />
      ) : (
        <div style={{ outline: 'none', minHeight: '1em' }}>
          {initialText}
        </div>
      )}
    </div>
  );
};

export default EditableText;
