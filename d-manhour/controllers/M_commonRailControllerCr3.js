// src/controllers/commonRailControllerCr3.js

const CommonRailCr3 = require("../models/commonRailModelCr3");
const { success, error } = require("../utils/response");

const getAllCr3 = async (req, res) => {
  try {
    const data = await CommonRailCr3.getAllCr3();
    res.json(success("Get all data", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

const getByIdCr3 = async (req, res) => {
  try {
    const data = await CommonRailCr3.getByIdCr3(req.params.id);
    if (!data) return res.status(404).json(error("Data not found"));
    res.json(success("Get data by id", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};


const getAllCr3Hourly = async (req, res) => {
  try {
    const data = await CommonRailCr3.getAllCr3Hourly();
    res.json(success("Get all data", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

const getByIdCr3Hourly = async (req, res) => {
  try {
    const data = await CommonRailCr3.getByIdCr3Hourly(req.params.id);
    if (!data) return res.status(404).json(error("Data not found"));
    res.json(success("Get data by id", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};









const getAllCr34n13 = async (req, res) => {
  try {
    const data = await CommonRailCr3.getAllCr34n13();
    res.json(success("Get all data", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

const getByIdCr334n13 = async (req, res) => {
  try {
    const data = await CommonRailCr3.getByIdCr334n13(req.params.id);
    if (!data) return res.status(404).json(error("Data not found"));
    res.json(success("Get data by id", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

const getAllCr34n13Report = async (req, res) => {
  try {
    const data = await CommonRailCr3.getAllCr34n13Report();
    res.json(success("Get all data", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

const getByIdCr334n13Report = async (req, res) => {
  try {
    const data = await CommonRailCr3.getByIdCr334n13Report(req.params.id);
    if (!data) return res.status(404).json(error("Data not found"));
    res.json(success("Get data by id", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};












const create = async (req, res) => {
  try {
    const data = await CommonRailCr3.create(req.body);
    res.json(success("Data created", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

const update = async (req, res) => {
  try {
    const data = await CommonRailCr3.update(req.params.id, req.body);
    res.json(success("Data updated", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

const remove = async (req, res) => {
  try {
    const data = await CommonRailCr3.remove(req.params.id);
    res.json(success("Data deleted", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};

module.exports = {
  getAllCr3,
  getByIdCr3,
  getAllCr3Hourly,
  getByIdCr3Hourly,
  getAllCr34n13,
  getByIdCr334n13,
  getAllCr34n13Report,
  getByIdCr334n13Report,
  create,
  update,
  remove
};