const CommonRailCr9 = require("../models/TrialCommonRail9");
const { success, error } = require("../utils/response");



const getAllCr9 = async (req, res) => {
  try {
    const data = await CommonRailCr9.getAllCr9();
    res.json(success("Get all data", data));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
};



module.exports = {
  getAllCr9
};