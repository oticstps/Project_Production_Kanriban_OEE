const express = require("express");
const router = express.Router();
const controller = require("../controllers/commonRailControllerCr10");

// GET
router.get("/cr10", controller.getAllCr10);
router.get("/cr10Stop", controller.getAllCr10Stop);
router.get("/cr10/:id", controller.getByIdCr10);

// POST / PUT / DELETE
router.post("/cr10", controller.create);
router.put("/cr10/:id", controller.update);
router.delete("/cr10/:id", controller.remove);

module.exports = router;