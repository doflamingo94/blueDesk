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
        const sql = "SELECT COUNT(*) AS email_count FROM candidats WHERE mail = ?";
        const [rows, fields] = await pool.query(sql, [mail]);
        const emailCount = rows[0].email_count;
        const sql2 = "SELECT COUNT(*) AS phone_count FROM candidats WHERE phone = ?";
        const [rows2, fields2] = await pool.query(sql2, [phone]);
        const phoneCount = rows2[0].phone_count;
        if(emailCount > 0){
          res.json({ data: 'mail existant' });
        } else if (phoneCount > 0){
          res.json({ data: 'téléphone existant' });
        } else {
              bcrypt.hash(pass, 10, async(err, hash) => {
                const sql = "INSERT INTO candidats (prenom, nom, date_naissance, date_creation, mail, phone, pass, sexe, pays) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?)";
                const [rows, fields] = await pool.query(sql, [prenom, nom, date_naissance, mail, phone, hash, sexe, pays]);
                res.json({ data: rows });
              });    
        }
        // bcrypt.hash(pass, 10, async(err, hash) => {
        //   const sql = "INSERT INTO candidats (prenom, nom, date_naissance, date_creation, mail, phone, pass, sexe) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?)";
        //   const [rows, fields] = await pool.query(sql, [prenom, nom, date_naissance, mail, phone, hash, sexe]);
        //   res.json({ data: rows });
        // });    
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
            const result = await bcrypt.compare(pass, user.pass);
    
            if (result) {
              const userId = user.id;
              const role = 'candidat';
              res.json({ status: "success", message: "Login successful", userId, role });
            } else {
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
        const sql = "SELECT annonces.poste, candidatures.id_candidat, candidatures.id_annonce, candidatures.statut, employeurs.nom AS employeur_nom, candidatures.date_candidature FROM candidatures JOIN annonces ON candidatures.id_annonce = annonces.id JOIN employeurs ON annonces.id_employeur = employeurs.id WHERE candidatures.id_candidat = ?";
        const [rows, fields] = await pool.query(sql, [id_candidat]);
        res.json({data: rows, status: "success"})
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    candidater: async (req, res) => {
      try {
        const { id_candidat, id_annonce, statut } = req.body;
          const sql = "INSERT INTO candidatures (id_candidat, id_annonce, date_candidature, statut) VALUES(?, ?, NOW(), ?);";
          const [rows, fields] = await pool.query(sql, [id_candidat, id_annonce, statut]);
          res.json({ data: rows });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    getCandidature: async (req, res) => {
      try {
        const { id_candidat, id_annonce } = req.body;
        const sql = "SELECT * FROM candidatures WHERE id_candidat = ? AND id_annonce = ?";
        const [rows, fields] = await pool.query(sql, [id_candidat, id_annonce]);
        res.json({ data: rows, infoo: id_annonce, infooo2: id_candidat });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    deleteCandidature: async (req, res) => {
      try {
        const { id_candidat, id_annonce } = req.body;
        const sql = "DELETE FROM candidatures WHERE id_candidat = ? AND id_annonce = ?";
        const [rows, fields] = await pool.query(sql, [id_candidat, id_annonce]);
        res.json({ data: rows, infoo: id_annonce, infooo2: id_candidat });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    updatePp: async (req, res) => {
      try {
        const { url_pp, id } = req.body;
        const sql = "UPDATE candidats SET url_pp = ? WHERE id = ?";
        const [rows, fields] = await pool.query(sql, [url_pp, id]);
        res.json({ data: rows });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    insertExperience: async (req, res) => {
      try {
        const { id_candidat, poste, employeur, date_debut, date_fin, pays, ville } = req.body;
  
        // Insert into experiences table
        const experienceSql = "INSERT INTO experiences (poste, employeur, date_debut, date_fin, pays, ville) VALUES (?, ?, ?, ?, ?, ?);";
        const [experienceRows, _] = await pool.query(experienceSql, [poste, employeur, date_debut, date_fin, pays, ville]);
  
        // Get the ID of the last inserted experience
        const experienceId = experienceRows.insertId;
  
        // Insert into exp_candi table to link the experience with the candidate
        const expCandiSql = "INSERT INTO exp_candi (id_candidat, id_experience) VALUES (?, ?);";
        await pool.query(expCandiSql, [id_candidat, experienceId]);
  
        res.json({ status: "success", message: "Experience inserted successfully." });
      } catch (error) {
          console.log(error);
          res.json({ status: "error", message: error.message });
      }
    },
    insertDescription: async (req, res) => {
      try {
        const { id, description } = req.body;

        // Update the description of the candidat
        const sql = "UPDATE candidats SET description = ? WHERE id = ?";
        await pool.query(sql, [description, id]);
  
        res.json({ status: "success", message: "Description inserted successfully." });
      } catch (error) {
          console.log(error);
          res.json({ status: "error", message: error.message });
      }
    },
    insertPays: async (req, res) => {
      try {
        const { id, pays } = req.body;

        // Update the description of the candidat
        const sql = "UPDATE candidats SET pays = ? WHERE id = ?";
        await pool.query(sql, [pays, id]);
  
        res.json({ status: "success", message: "Pays inserted successfully." });
      } catch (error) {
          console.log(error);
          res.json({ status: "error", message: error.message });
      }
    },
    insertProfession: async (req, res) => {
      try {
        const { id, profession } = req.body;

        // Update the description of the candidat
        const sql = "UPDATE candidats SET profession = ? WHERE id = ?";
        await pool.query(sql, [profession, id]);
  
        res.json({ status: "success", message: "Profession inserted successfully." });
      } catch (error) {
          console.log(error);
          res.json({ status: "error", message: error.message });
      }
    },
    insertFormation: async (req, res) => {
      try {
        const { id_candidat, nom, ecole, date_debut, date_fin, pays, ville } = req.body;
  
        // Insert into formations table
        const formationSql = "INSERT INTO formations (nom, ecole, date_debut, date_fin, pays, ville) VALUES (?, ?, ?, ?, ?, ?);";
        const [formationRows, _] = await pool.query(formationSql, [nom, ecole, date_debut, date_fin, pays, ville]);
  
        // Get the ID of the last inserted formation
        const formationId = formationRows.insertId;
  
        // Insert into form_candi table to link the formation with the candidate
        const formCandiSql = "INSERT INTO form_candi (id_candidat, id_formation) VALUES (?, ?);";
        await pool.query(formCandiSql, [id_candidat, formationId]);
  
        res.json({ status: "success", message: "Formation inserted successfully." });
      } catch (error) {
          console.log(error);
          res.json({ status: "error", message: error.message });
      }
    },
    getProfile: async (req, res) => {
      try {
        const { id } = req.params;
        const sql = "SELECT e.poste AS poste_experience, e.employeur AS employeur_experience, e.date_debut AS debut_experience, e.date_fin AS fin_experience, f.nom AS nom_formation, f.ecole AS ecole_formation, f.date_debut AS debut_formation, f.date_fin AS fin_formati FROM candidats LEFT JOIN exp_candi ec ON c.id = ec.id_candid LEFT JOIN experiences e ON ec.id_experience = e. LEFT JOIN form_candi fc ON c.id = fc.id_candid LEFT JOIN formations f ON fc.id_formation = f. WHERE c.id = ?";
        const [rows, fields] = await pool.query(sql, [id]);
        res.json({ data: rows });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    getExperiences: async (req, res) => {
      try {
        const { id_candidat } = req.body;
        // Select all experiences of the candidat
        const sql = "SELECT * FROM experiences WHERE id IN (SELECT id_experience FROM exp_candi WHERE id_candidat = ?)";
        const [rows, fields] = await pool.query(sql, [id_candidat]);

        res.json({ status: "success 44444", data: rows });
      } catch (error) {
          console.log(error);
          res.json({ status: "error 55555", message: error.message });
      }
    },
    getFormations: async (req, res) => {
      try {
        const { id_candidat } = req.body;

        // Select all formations of the candidat
        const sql = "SELECT * FROM formations WHERE id IN (SELECT id_formation FROM form_candi WHERE id_candidat = ?)";
        const [rows, fields] = await pool.query(sql, [id_candidat]);

        res.json({ status: "success", data: rows });
      } catch (error) {
          console.log(error);
          res.json({ status: "error", message: error.message });
      }
    },
    updateFormation: async (req, res) => {
        try {
            const { id_formation, nom, ecole, date_debut, date_fin, pays, ville } = req.body;
    
            // Update the formation in the formations table
            const sql = `
                UPDATE formations
                SET nom = ?, ecole = ?, date_debut = ?, date_fin = ?, pays = ?, ville = ?
                WHERE id = ?;
            `;
            await pool.query(sql, [nom, ecole, date_debut, date_fin, pays, ville, id_formation]);
    
            res.json({ status: "success", message: "Formation updated successfully." });
        } catch (error) {
            console.log(error);
            res.json({ status: "error", message: error.message });
        }
    },
    updateExperience: async (req, res) => {
        try {
            const { id_experience, poste, employeur, date_debut, date_fin, pays, ville } = req.body;
    
            // Update the experience in the experiences table
            const sql = `
                UPDATE experiences
                SET poste = ?, employeur = ?, date_debut = ?, date_fin = ?, pays = ?, ville = ?
                WHERE id = ?;
            `;
            await pool.query(sql, [poste, employeur, date_debut, date_fin, pays, ville, id_experience]);
    
            res.json({ status: "success", message: "Experience updated successfully." });
        } catch (error) {
            console.log(error);
            res.json({ status: "error", message: error.message });
        }
    },
    deleteFormation: async (req, res) => {
        try {
            const { id_formation } = req.body;
    
            // Supprimer les liens de la formation avec les candidats dans la table form_candi
            const deleteLinkSql = `
                DELETE FROM form_candi
                WHERE id_formation = ?;
            `;
            await pool.query(deleteLinkSql, [id_formation]);
            
            // Supprimer la formation de la table formations
            const sql = `
                DELETE FROM formations
                WHERE id = ?;
            `;
            await pool.query(sql, [id_formation]);
    
    
            res.json({ status: "success", message: "Formation deleted successfully." });
        } catch (error) {
            console.log(error);
            res.json({ status: "error", message: error.message });
        }
    },
    deleteExperience: async (req, res) => {
        try {
            const { id_experience } = req.body;
    
            // Supprimer les liens de l'expérience avec les candidats dans la table exp_candi
            const deleteLinkSql = `
                DELETE FROM exp_candi
                WHERE id_experience = ?;
            `;
            await pool.query(deleteLinkSql, [id_experience]);

            // Supprimer l'expérience de la table experiences
            const sql = `
                DELETE FROM experiences
                WHERE id = ?;
            `;
            await pool.query(sql, [id_experience]);
    
    
            res.json({ status: "success", message: "Experience deleted successfully." });
        } catch (error) {
            console.log(error);
            res.json({ status: "error", message: error.message });
        }
    }
  };
  
  module.exports = candidatsController;
  