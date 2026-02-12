const express = require("express");
const router = express.Router();
const controller = require("../controllers/commonRailControllerCr6");

// GET
router.get("/cr6", controller.getAllCr6);
router.get("/cr6Stop", controller.getAllCr6Stop);
router.get("/cr6/:id", controller.getByIdCr6);

// POST / PUT / DELETE
router.post("/cr6", controller.create);
router.put("/cr6/:id", controller.update);
router.delete("/cr6/:id", controller.remove);

module.exports = router;