const express = require("express");
const router = express.Router();
const controller = require("../controllers/commonRailControllerCr11");

// GET
router.get("/cr11", controller.getAllCr11);
router.get("/cr11Stop", controller.getAllCr11Stop);
router.get("/cr11/:id", controller.getByIdCr11);

// POST / PUT / DELETE
router.post("/cr11", controller.create);
router.put("/cr11/:id", controller.update);
router.delete("/cr11/:id", controller.remove);

module.exports = router;