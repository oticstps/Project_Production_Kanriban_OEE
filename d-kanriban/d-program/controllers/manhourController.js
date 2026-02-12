// controllers/manhourController.js
const Manhour = require('../models/manhour.model');
const { success, error } = require('../utils/response'); // Impor sesuai struktur baru

const manhourController = {
  getAll: async (req, res) => {
    try {
      const manhours = await Manhour.getAll();
      // Gunakan fungsi success dari utils/response
      res.json(success('Manhour data retrieved successfully', manhours));
    } catch (error) {
      console.error('Error fetching manhour data:', error);
      // Kirim respons error 500 ke klien
      res.status(500).json(error('Failed to retrieve manhour data'));
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      const manhour = await Manhour.getById(id);

      if (!manhour) {
        // Gunakan fungsi error dari utils/response
        return res.status(404).json(error('Manhour data not found'));
      }

      // Gunakan fungsi success dari utils/response
      res.json(success('Manhour data retrieved successfully', manhour));
    } catch (error) {
      console.error('Error fetching manhour data by ID:', error);
      // Kirim respons error 500 ke klien
      res.status(500).json(error('Failed to retrieve manhour data'));
    }
  },

  create: async (req, res) => {
    try {
      const manhourData = req.body;

      // Validasi sederhana
      if (!manhourData.product_name || !manhourData.start_time || !manhourData.end_time) {
        // Gunakan fungsi error dari utils/response
        return res.status(400).json(error('Product name, start time, and end time are required'));
      }

      const newManhour = await Manhour.create(manhourData);
      // Gunakan fungsi success dari utils/response
      res.status(201).json(success('Manhour data created successfully', newManhour));
    } catch (error) {
      console.error('Error creating manhour data:', error);
      // Kirim respons error 500 ke klien
      res.status(500).json(error('Failed to create manhour data'));
    }
  },

  update: async (req, res) => {
    try {
      const { id } = req.params;
      const manhourData = req.body;

      // Validasi sederhana
      if (!manhourData.product_name || !manhourData.start_time || !manhourData.end_time) {
        // Gunakan fungsi error dari utils/response
        return res.status(400).json(error('Product name, start time, and end time are required'));
      }

      const updatedManhour = await Manhour.updateById(id, manhourData);

      if (!updatedManhour) {
        // Gunakan fungsi error dari utils/response
        return res.status(404).json(error('Manhour data not found or no changes made'));
      }

      // Gunakan fungsi success dari utils/response
      res.json(success('Manhour data updated successfully', updatedManhour));
    } catch (error) {
      console.error('Error updating manhour data:', error);
      // Kirim respons error 500 ke klien
      res.status(500).json(error('Failed to update manhour data'));
    }
  },

  delete: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Manhour.deleteById(id);

      if (!deleted) {
        // Gunakan fungsi error dari utils/response
        return res.status(404).json(error('Manhour data not found'));
      }

      // Gunakan fungsi success dari utils/response
      res.json(success('Manhour data deleted successfully', null)); // Biasanya data kosong saat delete
    } catch (error) {
      console.error('Error deleting manhour data:', error);
      // Kirim respons error 500 ke klien
      res.status(500).json(error('Failed to delete manhour data'));
    }
  }
};

module.exports = manhourController;