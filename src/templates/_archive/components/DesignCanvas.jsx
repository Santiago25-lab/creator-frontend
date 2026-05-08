import React, { useState, useRef, useEffect } from 'react';

const DesignCanvas = ({ children, isEditMode, onDeselect, onSelectMultiple }) => {
  const [marquee, setMarquee] = useState(null);
  const canvasRef = useRef(null);

  const onMouseDown = (e) => {
    // Si el clic es en el lienzo vacío, deseleccionamos y empezamos el lazo
    if (!isEditMode || e.target !== canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    
    setMarquee({ startX, startY, currentX: startX, currentY: startY });
    onDeselect && onDeselect();
  };

  const onMouseMove = (e) => {
    if (!marquee) return;
    const rect = canvasRef.current.getBoundingClientRect();
    setMarquee({ ...marquee, currentX: e.clientX - rect.left, currentY: e.clientY - rect.top });
  };

  const onMouseUp = () => {
    if (marquee) {
      // Aquí iría la lógica de detección de colisión si tuviéramos un sistema de estados global para cada capa.
      // Por ahora, el lazo sirve como feedback visual y deselección global.
      setMarquee(null);
    }
  };

  const marqueeStyle = marquee ? {
    position: 'absolute',
    border: '1px solid #3b82f6',
    background: 'rgba(59, 130, 246, 0.2)',
    left: Math.min(marquee.startX, marquee.currentX),
    top: Math.min(marquee.startY, marquee.currentY),
    width: Math.abs(marquee.startX - marquee.currentX),
    height: Math.abs(marquee.startY - marquee.currentY),
    pointerEvents: 'none',
    zIndex: 5000,
    borderRadius: '2px'
  } : null;

  return (
    <div 
      ref={canvasRef}
      className="design-canvas-root"
      style={{ 
        position: 'relative', 
        width: '210mm', 
        minHeight: '297mm', 
        background: '#fff', 
        boxShadow: '0 20px 60px rgba(0,0,0,0.5)', 
        cursor: isEditMode ? 'crosshair' : 'default',
        transform: 'scale(0.9)',
        transformOrigin: 'top center',
        transition: 'transform 0.3s ease'
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    >
      {marquee && <div style={marqueeStyle}></div>}
      <div style={{ pointerEvents: marquee ? 'none' : 'auto', height: '100%' }}>
        {children}
      </div>
    </div>
  );
};

export default DesignCanvas;
