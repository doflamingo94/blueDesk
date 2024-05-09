const express = require('express');
const router = express.Router();

const employeursController = require("../controller/employeurs.controlleur");

router.get("/", employeursController.getAll);
router.get("/:id", employeursController.getOne);
router.post("/", employeursController.create);
router.put("/:id", employeursController.updateOne);
router.delete("/:id", employeursController.deleteOne);
router.post("/login", employeursController.login);
router.post("/mesAnnonces", employeursController.mesAnnonces);
router.post("/deleteAnnonce", employeursController.deleteAnnonce);
router.post("/refuser", employeursController.refusCandidature);
router.post("/valider", employeursController.ValiderCandidature);
router.post("/logo", employeursController.updateLogo);
router.post("/secteur", employeursController.insertSecteur);
router.post("/ville", employeursController.insertVille);
router.post("/description", employeursController.insertDescription);
router.get("/profil/:nom", employeursController.getProfil);
router.get("/verify-email/:token", employeursController.verifMailToken);
router.get("/retryMail/:mail", employeursController.retryMailToken);
router.post("/forgotPass", employeursController.forgotPass);
router.post("/resetPass", employeursController.resetPass);

module.exports = router;