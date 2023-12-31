const jwt = require('jsonwebtoken');
const pool = require("../database/index");
const bcrypt = require("bcrypt");

const employeursController = {
    getAll: async (req, res) => {
      try {
        const sql = "SELECT * FROM employeurs";
        const [rows, fields] = await pool.query(sql);
        res.json({ data: rows });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    getOne: async (req, res) => {
      try {
        const { id } = req.params;
        const sql = "SELECT * FROM employeurs WHERE id = ?";
        const [rows, fields] = await pool.query(sql, [id]);
        res.json({ data: rows });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    create: async (req, res) => {
      try {
        const { nom, numero_siret, pass, identifiant, phone, mail } = req.body;
        bcrypt.hash(pass, 10, async (err, hash) => {
          const sql = "INSERT INTO employeurs (nom, numero_siret, pass, identifiant, phone, mail, date_creation) VALUES (?, ?, ?, ?, ?, ?, NOW())";
          const [rows, fields] = await pool.query(sql, [nom, numero_siret, hash, identifiant, phone, mail]);
          res.json({ data: rows });
        });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    deleteOne: async (req, res) => {
      try {
        const { id } = req.params;
        const sql = "DELETE FROM employeurs WHERE id = ?";
        const [rows, fields] = await pool.query(sql, [id]);
        res.json({ data: rows });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    updateOne: async (req, res) => {
      try {
        const { nom, numero_siret, pass, url_logo, url_banniere, identifiant, phone, mail } = req.body;
        const { id } = req.params;
        const sql = "UPDATE employeurs SET nom = ?, numero_siret = ?, pass = ?, url_logo = ?, url_banniere = ?, identifiant = ?, phone = ?, mail = ?, WHERE id = ?";
        const [rows, fields] = await pool.query(sql, [nom, numero_siret, pass, url_logo, url_banniere, identifiant, phone, mail, id]);
        res.json({ data: rows });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    login: async (req, res) => {
      try {
        const { identifiant, pass } = req.body;
        const sql = "SELECT * FROM employeurs WHERE identifiant = ?";
        const [rows, fields] = await pool.query(sql, [identifiant]);
        if (rows.length === 1) {
          const user = rows[0];
    
          try {
            // Using bcrypt.compare with await
            const result = await bcrypt.compare(pass, user.pass);
    
            if (result) {
              const userId = user.id;
              const role = 'employeur';
              res.json({ status: "success", message: "Login successful", userId, role });
            } else {
              // Passwords do not match
              res.json({ status: "error", message: "Invalid credentials" });
            }
          } catch (bcryptError) {
            console.error(bcryptError);
            res.json({ status: "error", message: "Error during password comparison" });
          }
        } else {
          res.json({ status: "error", message: "Invalid credentials" });
        }
      } catch (error) {
        console.error(error);
        res.json({ status: "error", message: error.message });
      }
    },
    mesAnnonces: async (req, res) => {
      try {
        const { id_employeur } = req.body; // Assuming you're sending id_employeur in the request body
    
        const sql = `
          SELECT annonces.poste, annonces.id AS annonce_id, annonces.titre, annonces.date_creation, 
          annonces.profil, annonces.banniere, annonces.lieu, annonces.date_debut, annonces.date_fin, 
          annonces.salaire, annonces.description_poste
          FROM annonces
          JOIN employeurs ON annonces.id_employeur = employeurs.id
          WHERE employeurs.id = ?
        `;
    
        const [rows, fields] = await pool.query(sql, [id_employeur]);
        res.json({ data: rows, status: 'success' });
      } catch (error) {
        console.log(error);
        res.json({ status: 'error', message: error.message });
      }
    },
    deleteAnnonce: async (req, res) => {
      try {
        const { id_employeur, id_annonce } = req.body; // Assuming you're sending id_employeur and annonce_id in the request body
    
        // Delete candidatures associated with the annonce
        const deleteCandidaturesSQL = 'DELETE FROM candidatures WHERE id_annonce = ?;';
        await pool.query(deleteCandidaturesSQL, [id_annonce]);

        // Delete the annonce
        const deleteAnnonceSQL = 'DELETE FROM annonces WHERE id = ? AND id_employeur = ?;';
        const [deleteAnnonceResult] = await pool.query(deleteAnnonceSQL, [id_annonce, id_employeur]);
    
        if (deleteAnnonceResult.affectedRows > 0) {
          res.json({ status: 'success', message: 'Announcement deleted successfully.' });
        } else {
          res.json({ status: 'error', message: 'Announcement not found or you do not have permission to delete it.' });
        }
      } catch (error) {
        console.log(error);
        res.json({ status: 'error', message: error.message });
      }
    },
    refusCandidature: async (req, res) => {
      try {
        const { id_annonce, id_candidat } = req.body;
        const sql = "UPDATE candidatures SET statut = 'refusé' WHERE id_candidat = ? AND id_annonce = ?;";
        const [rows, fields] = await pool.query(sql, [id_candidat, id_annonce]);
        res.json({ data: rows });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    ValiderCandidature: async (req, res) => {
      try {
        const { id_annonce, id_candidat } = req.body;
        const sql = "UPDATE candidatures SET statut = 'retenue' WHERE id_candidat = ? AND id_annonce = ?;";
        const [rows, fields] = await pool.query(sql, [id_candidat, id_annonce]);
        res.json({ data: rows });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    }
  };
  
  module.exports = employeursController;