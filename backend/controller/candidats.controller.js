const jwt = require('jsonwebtoken')
const pool = require("../database/index");
const bcrypt = require("bcrypt");

const candidatsController = {
    getAll: async (req, res) => {
      try {
        const sql = "SELECT * FROM candidats";
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
        const sql = "SELECT * FROM candidats WHERE id = ?";
        const [rows, fields] = await pool.query(sql, [id]);
        res.json({ data: rows });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    create: async (req, res) => {
      try {
        const { prenom, nom, date_naissance, mail, phone, pass, sexe } = req.body;
        bcrypt.hash(pass, 10, async(err, hash) => {
          const sql = "INSERT INTO candidats (prenom, nom, date_naissance, date_creation, mail, phone, pass, sexe) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)";
          const [rows, fields] = await pool.query(sql, [prenom, nom, date_naissance, mail, phone, hash, sexe]);
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
        const sql = "DELETE FROM candidats WHERE id = ?";
        const [rows, fields] = await pool.query(sql, [id]);
        res.json({ data: rows });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    updateOne: async (req, res) => {
      try {
        const { prenom, nom, date_naissance, mail, phone, pass, url_pp, url_cv, sexe } = req.body;
        const { id } = req.params;
        const sql = "UPDATE candidats SET prenom = ?, nom = ?, date_naissance = ?, mail = ?, phone = ?, pass = ?, url_pp = ?, url_cv = ?, sexe = ? WHERE id = ?";
        const [rows, fields] = await pool.query(sql, [prenom, nom, date_naissance, mail, phone, pass, url_pp, url_cv, sexe, id]);
        res.json({ data: rows });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    login: async (req, res) => {
      try {
        const { mail, pass } = req.body;
        const sql = "SELECT * FROM candidats WHERE mail = ?";
        const [rows, fields] = await pool.query(sql, [mail]);
        if (rows.length === 1) {
          const user = rows[0];

          try {
            // Using bcrypt.compare with await
            const result = await bcrypt.compare(pass, user.pass);
    
            if (result) {
              const userId = user.id;
              const role = 'candidat';
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
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    getCandidatures: async (req, res) => {
      try {
        const { id_candidat } = req.body;
        const sql = "SELECT annonces.poste, employeurs.nom AS employeur_nom, candidatures.date_candidature FROM candidatures JOIN annonces ON candidatures.id_annonce = annonces.id JOIN employeurs ON annonces.id_employeur = employeurs.id WHERE candidatures.id_candidat = ?";
        const [rows, fields] = await pool.query(sql, [id_candidat]);
        res.json({data: rows, status: "success"})
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    }
  };
  
  module.exports = candidatsController;
  