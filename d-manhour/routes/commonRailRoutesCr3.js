const express = require("express");
const router = express.Router();
const controller = require("../controllers/commonRailControllerCr3");

// GET
router.get("/cr3", controller.getAllCr3);
router.get("/cr3Stop", controller.getAllCr3Stop);
router.get("/cr3/:id", controller.getByIdCr3);

// POST / PUT / DELETE
router.post("/cr3", controller.create);
router.put("/cr3/:id", controller.update);
router.delete("/cr3/:id", controller.remove);

module.exports = router;