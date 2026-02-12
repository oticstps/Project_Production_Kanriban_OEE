// pages/KanribanManhour/components/DateFilter.jsx
import React from 'react';

const DateFilter = ({ selectedDate, onDateChange, availableDates }) => {
  return (
    <div style={{ 
      marginBottom: '1.2rem', 
      padding: '1rem', 
      border: '1px solid #ddd', 
      borderRadius: '0.3rem',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
    }}>
      <h3 style={{ 
        margin: '0 0 0.8rem 0', 
        color: '#333',
        fontSize: '1rem',
        fontWeight: '600'
      }}>
        Filter Data
      </h3>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '1rem', 
        flexWrap: 'wrap',
        marginBottom: '0.6rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <label 
            htmlFor="dateFilter" 
            style={{ 
              fontWeight: '500', 
              fontSize: '0.9rem',
              color: '#555',
              minWidth: '7rem'
            }}
          >
            Pilih Tanggal:
          </label>
          <input
            type="date"
            id="dateFilter"
            value={selectedDate || ''}
            onChange={(e) => onDateChange(e.target.value)}
            max={availableDates[0] || ''}
            style={{
              padding: '0.5rem',
              border: '1px solid #ccc',
              borderRadius: '0.25rem',
              fontSize: '0.9rem',
              minWidth: '10rem',
              backgroundColor: '#fff'
            }}
          />
        </div>
        
        {selectedDate && (
          <button
            onClick={() => onDateChange('')}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#f44336',
              color: 'white',
              border: '1px solid #e57373',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            Reset Filter
          </button>
        )}
      </div>
      
      {availableDates.length > 0 && (
        <div style={{ 
          marginTop: '0.6rem', 
          fontSize: '0.8rem', 
          color: '#666',
          fontStyle: 'italic'
        }}>
          Tanggal tersedia: {availableDates.length} hari
        </div>
      )}
    </div>
  );
};

export default DateFilter;