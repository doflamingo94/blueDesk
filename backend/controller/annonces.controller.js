const pool = require("../database/index");
const annoncesController = {
    getAll: async (req, res) => {
        try{
            const [rows, fields] = await pool.query("SELECT * FROM annonces");
            res.json({data: rows});
        } catch (error) {
            console.log(error);
        }
    },
    getOne: async (req, res) => {
        try{
            const { id } = req.params;
            const [rows, fields] = await pool.query("SELECT * FROM annonces WHERE id = ?", [id]);
            res.json({data: rows});
        } catch (error) {
            console.log(error);
        }
    },
    create: async (req, res) => {
        try{
            const {titre, profil, banniere, lieu, date_debut, date_fin, poste, salaire, description_poste, id_employeur} = req.body;
            const sql = "INSERT INTO annonces (titre, profil, banniere, lieu, date_debut, date_fin, poste, salaire, description_poste, id_employeur, date_creation) values(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
            const [rows, fields] = await pool.query(sql, [titre, profil, banniere, lieu, date_debut, date_fin, poste, salaire, description_poste, id_employeur]);
            res.json({data: rows});
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
    }
}

module.exports = annoncesController;