const CommonRailCr2 = require("../models/commonRailModelCr2");
const { success, error } = require("../utils/response");

const getAllCr2 = async (req, res) => {
  try {
    const data = await CommonRailCr2.getAllCr2();
    res.json(success("Get all data", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

const getByIdCr2 = async (req, res) => {
  try {
    const data = await CommonRailCr2.getByIdCr2(req.params.id);
    if (!data) return res.status(404).json(error("Data not found"));
    res.json(success("Get data by id", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

const getAllCr2Stop = async (req, res) => {
  try {
    const data = await CommonRailCr2.getAllCr2Stop();
    res.json(success("Get all data", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

// CRUD Controller Functions
const create = async (req, res) => {
  try {
    const data = await CommonRailCr2.create(req.body);
    res.status(201).json(success("Data created successfully", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

const update = async (req, res) => {
  try {
    const data = await CommonRailCr2.update(req.params.id, req.body);
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
    const result = await CommonRailCr2.remove(req.params.id);
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
  getAllCr2,
  getByIdCr2,
  getAllCr2Stop,
  create,
  update,
  remove,
};