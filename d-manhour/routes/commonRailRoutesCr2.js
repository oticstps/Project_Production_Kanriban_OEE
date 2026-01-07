const express = require("express");
const router = express.Router();
const controller = require("../controllers/commonRailControllerCr2");

// GET
router.get("/cr2", controller.getAllCr2);
router.get("/cr2Stop", controller.getAllCr2Stop);
router.get("/cr2/:id", controller.getByIdCr2);

// POST / PUT / DELETE
router.post("/cr2", controller.create);
router.put("/cr2/:id", controller.update);
router.delete("/cr2/:id", controller.remove);

module.exports = router;