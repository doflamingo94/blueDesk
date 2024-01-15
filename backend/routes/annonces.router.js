const express = require('express');
const router = express.Router();

const annoncesController = require("../controller/annonces.controller");

router.get("/", annoncesController.getAll);
router.get("/:id", annoncesController.getOne);
router.post("/", annoncesController.create);
router.put("/:id", annoncesController.updateOne);
router.delete("/:id", annoncesController.deleteOne);
router.post("/candidatures", annoncesController.getCandidatures);
router.post("/search", annoncesController.searchPoste);

module.exports = router;