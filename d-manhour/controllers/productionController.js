// Project_Dashboard_TPS\D-Kanriban\D-program\controllers\productionController.js
const productionModel = require("../models/productionModel");

const create = async (req, res) => {
  try {
    const id = await productionModel.createProduction(req.body);
    res.status(201).json({ id, message: "Data berhasil ditambahkan" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Gagal menambahkan data" });
  }
};

const getAll = async (req, res) => {
  try {
    const data = await productionModel.getAllProductions();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data" });
  }
};

const getById = async (req, res) => {
  try {
    const data = await productionModel.getProductionById(req.params.id);
    if (!data) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Gagal mengambil data" });
  }
};

const update = async (req, res) => {
  try {
    const success = await productionModel.updateProduction(req.params.id, req.body);
    if (!success) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Data berhasil diperbarui" });
  } catch (error) {
    res.status(500).json({ error: "Gagal memperbarui data" });
  }
};

const remove = async (req, res) => {
  try {
    const success = await productionModel.deleteProduction(req.params.id);
    if (!success) return res.status(404).json({ error: "Data tidak ditemukan" });
    res.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ error: "Gagal menghapus data" });
  }
};

module.exports = { create, getAll, getById, update, remove };