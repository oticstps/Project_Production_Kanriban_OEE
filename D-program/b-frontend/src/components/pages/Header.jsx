// components/Part_Dashboard/Header.jsx
import React from 'react';
import { Form } from 'react-bootstrap';
import { FaBolt, FaCalendarAlt } from 'react-icons/fa';

const Header = ({ selectedMonth, handleMonthChange }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm">
      <h4 className="m-0 d-flex align-items-center text-primary" style={{ color: '#1a73e8' }}>
        <FaBolt className="me-2" size={24} />
        <span className="fw-bold">Otics Indonesia Energy Consumption Dashboard</span>
      </h4>

      <div className="d-flex align-items-center">
        <label htmlFor="monthSelect" className="me-2 text-muted d-none d-md-block">
          <FaCalendarAlt className="me-1" /> Select Month:
        </label>
        <Form.Select
          id="monthSelect"
          value={selectedMonth}
          onChange={handleMonthChange}
          className="form-select shadow-sm border-0 fw-semibold"
          style={{
            width: '180px',
            fontSize: '1rem',
            borderRadius: '8px',
            padding: '0.5rem 0.75rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.8)',
            transition: 'box-shadow 0.3s ease-in-out',
          }}
          aria-label="Select Month"
        >
          {[
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </Form.Select>
      </div>
    </div>
  );
};

export default Header;