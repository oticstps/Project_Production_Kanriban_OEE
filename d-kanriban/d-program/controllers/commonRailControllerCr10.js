const CommonRailCr10 = require("../models/commonRailModelCr10");
const { success, error } = require("../utils/response");

const getAllCr10 = async (req, res) => {
  try {
    const data = await CommonRailCr10.getAllCr10();
    res.json(success("Get all data", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

const getByIdCr10 = async (req, res) => {
  try {
    const data = await CommonRailCr10.getByIdCr10(req.params.id);
    if (!data) return res.status(404).json(error("Data not found"));
    res.json(success("Get data by id", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

const getAllCr10Stop = async (req, res) => {
  try {
    const data = await CommonRailCr10.getAllCr10Stop();
    res.json(success("Get all data", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

// CRUD Controller Functions
const create = async (req, res) => {
  try {
    const data = await CommonRailCr10.create(req.body);
    res.status(201).json(success("Data created successfully", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

const update = async (req, res) => {
  try {
    const data = await CommonRailCr10.update(req.params.id, req.body);
    res.json(success("Data updated successfully", data));
  } catch (err) {
    if (err.message === "Data not found") {
      res.status(404).json(error(err.message));
    } else {
      res.status(500).json(error(err.message));
    }
  }
};

const remove = async (req, res) => {
  try {
    const result = await CommonRailCr10.remove(req.params.id);
    res.json(success(result.message));
  } catch (err) {
    if (err.message === "Data not found") {
      res.status(404).json(error(err.message));
    } else {
      res.status(500).json(error(err.message));
    }
  }
};

module.exports = {
  getAllCr10,
  getByIdCr10,
  getAllCr10Stop,
  create,
  update,
  remove,
};