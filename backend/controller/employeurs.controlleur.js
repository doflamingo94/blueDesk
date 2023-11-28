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
    }
  };
  
  module.exports = employeursController;