const express = require("express");
const router = express.Router();
const controller = require("../controllers/commonRailControllerCr1");

// GET
router.get("/cr1", controller.getAllCr1);
router.get("/cr1Stop", controller.getAllCr1Stop);
router.get("/cr1/:id", controller.getByIdCr1);

// POST / PUT / DELETE
router.post("/cr1", controller.create);
router.put("/cr1/:id", controller.update);
router.delete("/cr1/:id", controller.remove);

module.exports = router;