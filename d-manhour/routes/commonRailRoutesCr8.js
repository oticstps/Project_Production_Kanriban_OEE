const express = require("express");
const router = express.Router();
const controller = require("../controllers/commonRailControllerCr8");

// GET
router.get("/cr8", controller.getAllCr8);
router.get("/cr8Stop", controller.getAllCr8Stop);
router.get("/cr8/:id", controller.getByIdCr8);

// POST / PUT / DELETE
router.post("/cr8", controller.create);
router.put("/cr8/:id", controller.update);
router.delete("/cr8/:id", controller.remove);

module.exports = router;