// src/components/dashboard/Manhour.jsx
import React, { useState, useEffect } from "react";

const API_BASE = "http://172.27.6.191:4000/api/productions";

const Manhour_Test = () => {
  const [productions, setProductions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const initialFormState = {
    tanggal: "",
    total_produksi: "",
    total_op: "",
    duration: "",
    loading_time: "",
    help_op: "",
    loading_time_help_op: "",
    mc_fault_duration: "",
    mc_fault_freq: "",
    dangae: "",
    quality_check: "",
    other: "",
    kaizen: "",
    five_s: "",
    detail_mh_inline: "",
    detail_mh_bantuan: "",
    detail_mh_5s: "",
    total_manhour: "",
    manhour_minutes_per_pcs: "",
    pe: "",
  };

  const [formData, setFormData] = useState(initialFormState);

  // Fetch all data
  const fetchProductions = async () => {
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Gagal mengambil data");
      const data = await res.json();
      setProductions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {};
    for (const key in formData) {
      if (key === "tanggal") {
        payload[key] = formData[key];
      } else {
        const num = parseFloat(formData[key]);
        payload[key] = isNaN(num) ? 0 : num;
      }
    }

    try {
      if (editingId) {
        await fetch(`${API_BASE}/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(API_BASE, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }
      setFormData(initialFormState);
      setShowForm(false);
      setEditingId(null);
      fetchProductions();
    } catch (err) {
      alert("Terjadi kesalahan saat menyimpan data.");
    }
  };

  const handleEdit = (item) => {
    const formattedDate = new Date(item.tanggal).toISOString().slice(0, 16);
    setFormData({
      tanggal: formattedDate,
      total_produksi: item.total_produksi,
      total_op: item.total_op,
      duration: item.duration,
      loading_time: item.loading_time,
      help_op: item.help_op,
      loading_time_help_op: item.loading_time_help_op,
      mc_fault_duration: item.mc_fault_duration,
      mc_fault_freq: item.mc_fault_freq,
      dangae: item.dangae,
      quality_check: item.quality_check,
      other: item.other,
      kaizen: item.kaizen,
      five_s: item.five_s,
      detail_mh_inline: item.detail_mh_inline,
      detail_mh_bantuan: item.detail_mh_bantuan,
      detail_mh_5s: item.detail_mh_5s,
      total_manhour: item.total_manhour,
      manhour_minutes_per_pcs: item.manhour_minutes_per_pcs,
      pe: item.pe,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      await fetch(`${API_BASE}/${id}`, { method: "DELETE" });
      fetchProductions();
    } catch (err) {
      alert("Gagal menghapus data.");
    }
  };

  if (loading) return <div className="p-6">Memuat data...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manhour & Production Dashboard</h1>

      <button
        onClick={() => {
          setFormData(initialFormState);
          setEditingId(null);
          setShowForm(!showForm);
        }}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        {showForm ? "Batal" : "+ Tambah Data Produksi"}
      </button>






      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8 border">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Data Produksi" : "Tambah Data Produksi"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tanggal *</label>
              <input
                type="datetime-local"
                name="tanggal"
                value={formData.tanggal}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Total Produksi *</label>
              <input
                type="number"
                step="0.01"
                name="total_produksi"
                value={formData.total_produksi}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Total OP *</label>
              <input
                type="number"
                name="total_op"
                value={formData.total_op}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Duration</label>
              <input
                type="number"
                step="0.01"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Loading Time</label>
              <input
                type="number"
                step="0.01"
                name="loading_time"
                value={formData.loading_time}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Help OP</label>
              <input
                type="number"
                name="help_op"
                value={formData.help_op}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Loading Time Help OP</label>
              <input
                type="number"
                step="0.01"
                name="loading_time_help_op"
                value={formData.loading_time_help_op}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">MC Fault Duration</label>
              <input
                type="number"
                step="0.01"
                name="mc_fault_duration"
                value={formData.mc_fault_duration}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">MC Fault Freq</label>
              <input
                type="number"
                name="mc_fault_freq"
                value={formData.mc_fault_freq}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Dangae</label>
              <input
                type="number"
                name="dangae"
                value={formData.dangae}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Quality Check</label>
              <input
                type="number"
                name="quality_check"
                value={formData.quality_check}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Other</label>
              <input
                type="number"
                name="other"
                value={formData.other}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Kaizen</label>
              <input
                type="number"
                name="kaizen"
                value={formData.kaizen}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">5S</label>
              <input
                type="number"
                name="five_s"
                value={formData.five_s}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Detail MH Inline</label>
              <input
                type="number"
                step="0.01"
                name="detail_mh_inline"
                value={formData.detail_mh_inline}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Detail MH Bantuan</label>
              <input
                type="number"
                step="0.01"
                name="detail_mh_bantuan"
                value={formData.detail_mh_bantuan}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Detail MH 5S</label>
              <input
                type="number"
                step="0.01"
                name="detail_mh_5s"
                value={formData.detail_mh_5s}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Total Manhour</label>
              <input
                type="number"
                step="0.01"
                name="total_manhour"
                value={formData.total_manhour}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Manhour Minutes/PCS</label>
              <input
                type="number"
                step="0.01"
                name="manhour_minutes_per_pcs"
                value={formData.manhour_minutes_per_pcs}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">PE</label>
              <input
                type="number"
                step="0.01"
                name="pe"
                value={formData.pe}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
              />
            </div>

            <div className="md:col-span-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                {editingId ? "Perbarui" : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      )}







      {/* Data Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produksi</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">OP</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Manhour</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PE</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productions.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Tidak ada data.
                </td>
              </tr>
            ) : (
              productions.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(p.tanggal).toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.total_produksi}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.total_op}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.total_manhour}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.pe}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Manhour_Test;