const pool = require("../database/index");
const annoncesController = {
    getAll: async (req, res) => {
        try{
            const [rows, fields] = await pool.query("SELECT annonces.*, employeurs.nom AS employeur_name FROM annonces JOIN employeurs ON annonces.id_employeur = employeurs.id ORDER BY annonces.date_creation DESC");
            res.json({data: rows});
        } catch (error) {
            console.log(error);
        }
    },
    getOne: async (req, res) => {
        try{
            const { id } = req.params;
            const [rows, fields] = await pool.query("SELECT annonces.*, employeurs.nom AS employeur_name FROM annonces JOIN employeurs ON annonces.id_employeur = employeurs.id WHERE annonces.id = ?", [id]); res.json({data: rows});
        } catch (error) {
            console.log(error);
        }
    },
    create: async (req, res) => {
        try{
            const {titre, lieu, date_debut, date_fin, poste, salaire, description_poste, id_employeur} = req.body;
            if(date_fin.length < 1){
                const sql = "INSERT INTO annonces (titre, date_creation, lieu, date_debut, poste, salaire, description_poste, id_employeur) values(?, NOW(), ?, ?, ?, ?, ?, ?)";
                const [rows, fields] = await pool.query(sql, [titre, lieu, date_debut, poste, salaire, description_poste, id_employeur]);
                res.json({data: rows});
            }
            else{
                const sql = "INSERT INTO annonces (titre, date_creation, lieu, date_debut, date_fin, poste, salaire, description_poste, id_employeur) values(?, NOW(), ?, ?, ?, ?, ?, ?, ?)";
                const [rows, fields] = await pool.query(sql, [titre, lieu, date_debut, date_fin, poste, salaire, description_poste, id_employeur]);
                res.json({data: rows});
            }
            
        } catch (error) {
            console.log(error);
        }
    },
    deleteOne: async (req, res) => {
        try{
            const { id } = req.params;
            const [rows, fields] = await pool.query("DELETE FROM annonces WHERE id = ?", [id]);
            res.json({data: rows});
        } catch (error) {
            console.log(error);
            res.json({status: "error"});
        }
    },
    updateOne: async (req, res) => {
        try{
            const {titre, profil, banniere, lieu, date_debut, date_fin, poste, salaire, description_poste} = req.body;
            const { id } = req.params;
            const sql = "UPDATE annonces SET titre = ?, profil = ?, banniere = ?, lieu = ?, date_debut = ?, date_fin = ?, poste = ?, salaire = ?, description_poste = ? where id = ?";            
            const [rows, fields] = await pool.query(sql, [titre, profil, banniere, lieu, date_debut, date_fin, poste, salaire, description_poste, id]);
            res.json({data: rows});
        } catch (error) {
            console.log(error);
            res.json({status: "error"});
        }
    },
    getCandidatures: async (req, res) => {
        try{
            const { id_annonce, id_employeur } = req.body;
            const [rows, fields] = await pool.query("SELECT candidats.id, candidats.prenom, candidats.nom, candidats.date_naissance, annonces.poste FROM candidats JOIN candidatures ON candidats.id = candidatures.id_candidat JOIN annonces ON candidatures.id_annonce = annonces.id WHERE candidatures.id_annonce = ? AND annonces.id_employeur = ?", [id_annonce, id_employeur]); res.json({data: rows});
        } catch (error) {
            console.log(error);
        }
    },
}

module.exports = annoncesController;