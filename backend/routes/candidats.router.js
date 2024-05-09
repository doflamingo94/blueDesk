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
router.get("/profile-candidat/:id", candidatsController.getProfile);
router.post("/insertProf", candidatsController.insertProfession);
router.post("/insertPays", candidatsController.insertPays);
router.post("/insertExp", candidatsController.insertExperience);
router.post("/insertForm", candidatsController.insertFormation);
router.post("/insertDesc", candidatsController.insertDescription);
router.post("/experiences", candidatsController.getExperiences);
router.post("/formations", candidatsController.getFormations);
router.post("/updateForm", candidatsController.updateFormation);
router.post("/updateExp", candidatsController.updateExperience);
router.post("/deleteForm", candidatsController.deleteFormation);
router.post("/deleteExp", candidatsController.deleteExperience);
router.get("/verify-email/:token", candidatsController.verifMailToken);
router.get("/retryMail/:mail", candidatsController.retryMailToken); 
router.post("/forgotPass", candidatsController.forgotPass);
router.post("/resetPass", candidatsController.resetPass);


module.exports = router;