const express = require('express');
const router = express.Router();

const candidatsController = require("../controller/candidats.controller");

router.get("/", candidatsController.getAll);
router.get("/:id", candidatsController.getOne);
router.post("/", candidatsController.create);
router.put("/:id", candidatsController.updateOne);
router.delete("/:id", candidatsController.deleteOne);
router.post("/login", candidatsController.login);
router.post("/candidatures", candidatsController.getCandidatures);
router.post("/candidature", candidatsController.getCandidature);
router.post("/candidater", candidatsController.candidater)
router.post("/deleteCandidature", candidatsController.deleteCandidature);
router.post("/update_pp", candidatsController.updatePp);

module.exports = router;