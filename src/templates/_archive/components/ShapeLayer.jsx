import React, { useState } from 'react';
import { Rnd } from 'react-rnd';

const ShapeLayer = ({ defaultPos, initialColor = '#ff5f8a', isEditMode, onSelect }) => {
  const [color, setColor] = useState(initialColor);
  const [isSelected, setIsSelected] = useState(false);

  const notifySelection = () => {
    if (isEditMode) {
      setIsSelected(true);
      onSelect && onSelect({ type: 'shape', color, setColor, setIsSelected });
    }
  };

  return (
    <Rnd
      default={defaultPos}
      disableDragging={!isEditMode}
      enableResizing={isEditMode}
      onDragStart={(e) => { e.stopPropagation(); notifySelection(); }}
      onResizeStart={(e) => { e.stopPropagation(); notifySelection(); }}
      onClick={(e) => { e.stopPropagation(); notifySelection(); }}
      style={{ zIndex: 1 }}
    >
      <div 
        style={{
          background: color,
          width: '100%',
          height: '100%',
          outline: isEditMode && isSelected ? '3px solid #3b82f6' : 'none',
          boxShadow: isEditMode && isSelected ? '0 0 20px rgba(59, 130, 246, 0.3)' : 'none',
          transition: 'all 0.1s ease',
          cursor: isEditMode ? 'move' : 'default',
          borderRadius: '4px'
        }}
      ></div>
    </Rnd>
  );
};

export default ShapeLayer;
