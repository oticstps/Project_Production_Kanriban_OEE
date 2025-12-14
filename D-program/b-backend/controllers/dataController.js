const ProductionData = require('../models/ProductionData');

const getAllData = async (req, res) => {
  try {
    const data = await ProductionData.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDataByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const data = await ProductionData.findByDate(date);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDataByProduct = async (req, res) => {
  try {
    const { productName } = req.params;
    const data = await ProductionData.findByProduct(productName);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createData = async (req, res) => {
  try {
    const id = await ProductionData.create(req.body);
    res.status(201).json({ message: 'Data created successfully', id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateData = async (req, res) => {
  try {
    await ProductionData.update(req.params.id, req.body);
    res.json({ message: 'Data updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteData = async (req, res) => {
  try {
    await ProductionData.delete(req.params.id);
    res.json({ message: 'Data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllData,
  getDataByDate,
  getDataByProduct,
  createData,
  updateData,
  deleteData
};