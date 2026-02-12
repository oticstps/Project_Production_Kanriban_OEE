import React from 'react';

const ButtonActualPcsUp = ({ label = 'Actual Pcs UP', onClick, disabled = false }) => {
  const styles = {
    button: {
      backgroundColor: disabled ? '#c7d2fe' : '#4f46e5',
      color: '#ffffff',
      padding: '10px 20px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      fontWeight: 600,
      cursor: disabled ? 'not-allowed' : 'pointer',
      boxShadow: disabled
        ? 'none'
        : '0 4px 10px rgba(79, 70, 229, 0.25)',
      transition: 'all 0.25s ease',
    },
  };

  return (
    <button
      style={styles.button}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};

export default ButtonActualPcsUp;
