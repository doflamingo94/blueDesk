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

module.exports = router;