const express = require("express");
const router = express.Router();
const controller = require("../controllers/commonRailControllerCr4");

// GET
router.get("/cr4", controller.getAllCr4);
router.get("/cr4Stop", controller.getAllCr4Stop);
router.get("/cr4/:id", controller.getByIdCr4);

// POST / PUT / DELETE
router.post("/cr4", controller.create);
router.put("/cr4/:id", controller.update);
router.delete("/cr4/:id", controller.remove);

module.exports = router;