const express = require('express');
const router = express.Router();

const competencesController = require("../controller/competences.controller");

router.get("/", competencesController.getAll);
router.get("/:id", competencesController.getOne);
router.post("/", competencesController.create);
router.put("/:id", competencesController.updateOne);
router.delete("/:id", competencesController.deleteOne);

module.exports = router;