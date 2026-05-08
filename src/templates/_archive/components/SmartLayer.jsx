import React, { useState, useRef, useEffect } from 'react';

const SmartLayer = ({ initialText, initialSize, initialBold = false, initialColor = '#000', initialFont = "'Poppins', sans-serif", style = {}, isEditMode, onSelect }) => {
  const [fontSize, setFontSize] = useState(initialSize || 16);
  const [isBold, setIsBold] = useState(initialBold);
  const [color, setColor] = useState(initialColor);
  const [fontFamily, setFontFamily] = useState(initialFont);
  const [isSelected, setIsSelected] = useState(false);

  // Esta función notifica a la barra superior con los estados actuales
  const notifySelection = () => {
    if (isEditMode) {
      setIsSelected(true);
      onSelect && onSelect({ 
        type: 'text', fontSize, setFontSize, isBold, setIsBold, color, setColor, fontFamily, setFontFamily, setIsSelected 
      });
    }
  };

  return (
    <div 
      style={{
        position: 'relative',
        display: 'inline-block',
        width: 'fit-content',
        minWidth: '20px',
        ...style,
        fontSize: `${fontSize}px`,
        fontWeight: isBold ? '900' : 'normal',
        color: color,
        fontFamily: fontFamily,
        outline: isEditMode && isSelected ? '2px solid #3b82f6' : 'none',
        boxShadow: isEditMode && isSelected ? '0 10px 30px rgba(59, 130, 246, 0.2)' : 'none',
        transition: 'outline 0.1s ease',
        cursor: isEditMode ? 'move' : 'default',
        padding: '6px 10px',
        borderRadius: '4px'
      }}
      onClick={(e) => { e.stopPropagation(); notifySelection(); }}
      onMouseDown={(e) => { e.stopPropagation(); notifySelection(); }}
    >
      {isEditMode && isSelected && (
          <div style={{ position: 'absolute', width: '10px', height: '10px', background: '#3b82f6', border: '2px solid white', top: '-5px', left: '-5px', zIndex: 10, borderRadius: '50%' }}></div>
      )}
      {/* 
        IMPORTANTE: nunca mezclar contentEditable con children gestionados por React.
        Cuando isEditMode=true usamos dangerouslySetInnerHTML para que React no toque los hijos.
        Cuando isEditMode=false React gestiona el text node normalmente.
      */}
      {isEditMode ? (
        <div
          contentEditable={true}
          suppressContentEditableWarning={true}
          style={{ outline: 'none' }}
          dangerouslySetInnerHTML={{ __html: initialText || '' }}
        />
      ) : (
        <div style={{ outline: 'none' }}>
          {initialText}
        </div>
      )}
    </div>
  );
};

export default SmartLayer;
