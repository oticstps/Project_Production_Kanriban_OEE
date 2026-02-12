const express = require("express");
const router = express.Router();
const controller = require("../controllers/commonRailControllerCr12");

// GET
router.get("/cr12", controller.getAllCr12);
router.get("/cr12Stop", controller.getAllCr12Stop);
router.get("/cr12/:id", controller.getByIdCr12);

// POST / PUT / DELETE
router.post("/cr12", controller.create);
router.put("/cr12/:id", controller.update);
router.delete("/cr12/:id", controller.remove);

module.exports = router;