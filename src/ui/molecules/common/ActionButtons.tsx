'use client';
import React from 'react';

const ActionButtons = ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => {
  return (
    <div>
      <button onClick={onEdit} className="text-blue-500 mr-2">Editar</button>
      <button onClick={onDelete} className="text-red-500">Eliminar</button>
    </div>
  );
};

export default ActionButtons;
