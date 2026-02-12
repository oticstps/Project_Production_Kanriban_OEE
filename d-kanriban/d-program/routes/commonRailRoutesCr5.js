const express = require("express");
const router = express.Router();
const controller = require("../controllers/commonRailControllerCr5");

// GET
router.get("/cr5", controller.getAllCr5);
router.get("/cr5Stop", controller.getAllCr5Stop);
router.get("/cr5/:id", controller.getByIdCr5);

// POST / PUT / DELETE
router.post("/cr5", controller.create);
router.put("/cr5/:id", controller.update);
router.delete("/cr5/:id", controller.remove);

module.exports = router;