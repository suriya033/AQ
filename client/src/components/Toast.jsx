import React from 'react';
import { useSalon } from '../context/SalonContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = () => {
  const { toast, setToast } = useSalon();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '24px',
        zIndex: 9999,
        background: isSuccess ? '#059669' : isError ? '#DC2626' : '#1A1A1A',
        color: '#FFFFFF',
        padding: '14px 20px',
        borderRadius: '12px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '0.92rem',
        fontWeight: '500',
        maxWidth: '380px',
        animation: 'slideUp 0.3s ease'
      }}
    >
      {isSuccess && <CheckCircle2 size={20} />}
      {isError && <AlertCircle size={20} />}
      {!isSuccess && !isError && <Info size={20} />}
      <span style={{ flex: 1 }}>{toast.message}</span>
      <button
        onClick={() => setToast(null)}
        style={{ color: '#FFF', opacity: 0.8, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
