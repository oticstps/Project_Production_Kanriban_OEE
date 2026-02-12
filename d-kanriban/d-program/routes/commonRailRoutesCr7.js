const express = require("express");
const router = express.Router();
const controller = require("../controllers/commonRailControllerCr7");

// GET
router.get("/cr7", controller.getAllCr7);
router.get("/cr7Stop", controller.getAllCr7Stop);
router.get("/cr7/:id", controller.getByIdCr7);

// POST / PUT / DELETE
router.post("/cr7", controller.create);
router.put("/cr7/:id", controller.update);
router.delete("/cr7/:id", controller.remove);

module.exports = router;