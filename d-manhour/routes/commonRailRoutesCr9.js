const express = require("express");
const router = express.Router();
const controller = require("../controllers/commonRailControllerCr9");

// GET
router.get("/cr9", controller.getAllCr9);
router.get("/cr9Stop", controller.getAllCr9Stop);
router.get("/cr9/:id", controller.getByIdCr9);

// POST / PUT / DELETE
router.post("/cr9", controller.create);
router.put("/cr9/:id", controller.update);
router.delete("/cr9/:id", controller.remove);

module.exports = router;