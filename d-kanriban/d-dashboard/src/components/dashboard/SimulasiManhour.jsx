// src/components/SimulasiManhour.jsx
import React, { useState, useEffect } from 'react';

const SimulasiManhour = ({ user }) => {


  
  const editableRoles = ['superadmin', 'admin', 'manager', 'supervisor'];
  const isEditable = editableRoles.includes(user?.role);

  
  const [formData, setFormData] = useState({
    production_group: '',
    line_production: '',
    part: '',
    status_part: '',
    bottle_neck_process: '',
    setup_manpower: '',
    setup_cycle_time: '',
    tanggal: '',
    shift: '',
    total_manpower: '',
    total_produksi: '',
    loading_time: '',
    manpower_help: '',
    loading_time_manpower_help: '',
    line_stop_quality_check: '',
    line_stop_perbaikan_mesin: '',
    line_stop_perbaikan_mesin_freq: '',
    line_stop_dangae: '',
    line_stop_another: '',
    kaizen: '',
    five_s: '',
    manhour_breakdown_in_line: '',
    manhour_breakdown_bantuan: '',
    manhour_breakdown_five_s: '',
    manhour_breakdown_linegai: '',
    manhour_minutes: '',
    manhour_minutes_per_pcs: '',
    pe: '',
  });

  
  useEffect(() => {
    // Contoh: fetch dari API
    // fetch('/api/tb_trial_manhour')
    //   .then(res => res.json())
    //   .then(data => setFormData(data[0] || {}))
    //   .catch(console.error);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isEditable) return;

    // Simpan data ke API
    console.log('Simpan data:', formData);
    // fetch('/api/tb_trial_manhour', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(formData),
    // });
    alert('Data berhasil disimpan!');
  };

  const handleReset = () => {
    setFormData({
      production_group: '',
      line_production: '',
      part: '',
      status_part: '',
      bottle_neck_process: '',
      setup_manpower: '',
      setup_cycle_time: '',
      tanggal: '',
      shift: '',
      total_manpower: '',
      total_produksi: '',
      loading_time: '',
      manpower_help: '',
      loading_time_manpower_help: '',
      line_stop_quality_check: '',
      line_stop_perbaikan_mesin: '',
      line_stop_perbaikan_mesin_freq: '',
      line_stop_dangae: '',
      line_stop_another: '',
      kaizen: '',
      five_s: '',
      manhour_breakdown_in_line: '',
      manhour_breakdown_bantuan: '',
      manhour_breakdown_five_s: '',
      manhour_breakdown_linegai: '',
      manhour_minutes: '',
      manhour_minutes_per_pcs: '',
      pe: '',
    });
  };

  const renderInput = (name, label, type = 'text') => {
    const value = formData[name];
    return (
      <div className="form-group">
        <label>{label}</label>
        {isEditable ? (
          <input
            type={type}
            name={name}
            value={value || ''}
            onChange={handleChange}
            className="form-control"
            disabled={!isEditable}
          />
        ) : (
          <div className="form-static">{value || '-'}</div>
        )}
      </div>
    );
  };

  return (
    <div className="simulasi-manhour-container">
      <h2>Simulasi Manhour</h2>
      <p>
        Status: <strong>{isEditable ? 'Mode Edit' : 'Mode Lihat'}</strong>
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-row">
          {renderInput('production_group', 'Production Group')}
          {renderInput('line_production', 'Line Produksi')}
          {renderInput('part', 'Part')}
          {renderInput('status_part', 'Status Part')}
          {renderInput('bottle_neck_process', 'Bottle Neck Process')}
          {renderInput('setup_manpower', 'Setup Manpower', 'number')}
          {renderInput('setup_cycle_time', 'Setup Cycle Time (detik)', 'number')}
          {renderInput('tanggal', 'Tanggal', 'date')}
          {renderInput('shift', 'Shift')}
          {renderInput('total_manpower', 'Total Manpower', 'number')}
          {renderInput('total_produksi', 'Total Produksi (pcs)', 'number')}
          {renderInput('loading_time', 'Loading Time (menit)', 'number')}
          {renderInput('manpower_help', 'Manpower Bantuan', 'number')}
          {renderInput(
            'loading_time_manpower_help',
            'Loading Time Manpower Bantuan (menit)',
            'number'
          )}
          {renderInput(
            'line_stop_quality_check',
            'Line Stop: Quality Check (menit)',
            'number'
          )}
          {renderInput(
            'line_stop_perbaikan_mesin',
            'Line Stop: Perbaikan Mesin (menit)',
            'number'
          )}
          {renderInput(
            'line_stop_perbaikan_mesin_freq',
            'Frekuensi Perbaikan Mesin',
            'number'
          )}
          {renderInput('line_stop_dangae', 'Line Stop: Dangae (menit)', 'number')}
          {renderInput(
            'line_stop_another',
            'Line Stop: Lainnya (menit)',
            'number'
          )}
          {renderInput('kaizen', 'Kaizen (menit)', 'number')}
          {renderInput('five_s', '5S (menit)', 'number')}
          {renderInput(
            'manhour_breakdown_in_line',
            'Manhour Breakdown In-Line (menit)',
            'number'
          )}
          {renderInput(
            'manhour_breakdown_bantuan',
            'Manhour Breakdown Bantuan (menit)',
            'number'
          )}
          {renderInput(
            'manhour_breakdown_five_s',
            'Manhour Breakdown 5S (menit)',
            'number'
          )}
          {renderInput(
            'manhour_breakdown_linegai',
            'Manhour Breakdown Linegai (menit)',
            'number'
          )}
          {renderInput('manhour_minutes', 'Total Manhour (menit)', 'number')}
          {renderInput(
            'manhour_minutes_per_pcs',
            'Manhour per PCS (menit/pcs)',
            'number'
          )}
          {renderInput('pe', 'PE')}
        </div>

        {isEditable && (
          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              Simpan
            </button>
            <button type="button" onClick={handleReset} className="btn btn-secondary">
              Reset
            </button>
          </div>
        )}
      </form>

      <style jsx>{`
        .simulasi-manhour-container {
          padding: 1.5rem;
          background: #f9f9f9;
          border-radius: 8px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .form-row {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1rem;
        }
        .form-group {
          margin-bottom: 0.8rem;
        }
        .form-group label {
          display: block;
          font-weight: bold;
          font-size: 0.9rem;
          margin-bottom: 0.3rem;
          color: #333;
        }
        .form-control {
          width: 100%;
          padding: 0.4rem 0.6rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 0.95rem;
        }
        .form-static {
          padding: 0.4rem 0.6rem;
          background: #eee;
          border-radius: 4px;
          min-height: 1.4rem;
        }
        .form-actions {
          margin-top: 1.5rem;
          display: flex;
          gap: 0.8rem;
        }
        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.95rem;
        }
        .btn-primary {
          background: #007bff;
          color: white;
        }
        .btn-secondary {
          background: #6c757d;
          color: white;
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default SimulasiManhour;