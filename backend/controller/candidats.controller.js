const pool = require("../database/index");
const bcrypt = require("bcrypt");
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const transporter = nodemailer.createTransport({
  service: 'outlook',
  auth: {
    user: 'khaledtestdev@hotmail.com',
    pass: 'SkywalkinDallas4real*',
  },
});

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
        const { prenom, nom, date_naissance, mail, phone, pass, sexe, pays } = req.body;
        const sql = "SELECT COUNT(*) AS email_count FROM candidats WHERE mail = ?";
        const [rows, fields] = await pool.query(sql, [mail]);
        const emailCount = rows[0].email_count;
        const sql2 = "SELECT COUNT(*) AS phone_count FROM candidats WHERE phone = ?";
        const [rows2, fields2] = await pool.query(sql2, [phone]);
        const phoneCount = rows2[0].phone_count;
        const verificationToken = crypto.randomBytes(20).toString('hex');
        if(emailCount > 0){
          res.json({ data: 'mail existant' });
        } else if (phoneCount > 0){
          res.json({ data: 'téléphone existant' });
        } else {
              bcrypt.hash(pass, 10, async(err, hash) => {
                if (err) throw err;
                try {
                  const sql = "INSERT INTO candidats (prenom, nom, date_naissance, date_creation, mail, phone, pass, sexe, pays, verification_token, is_verified) VALUES (?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?)";
                  const [rows, fields] = await pool.query(sql, [prenom, nom, date_naissance, mail, phone, hash, sexe, pays, verificationToken, false]);

                  const mailOptions = {
                    from: 'khaledtestdev@hotmail.com',
                    to: mail,
                    subject: 'Email Verification',
                    text: `Click the following link to verify your email: ${process.env.NUXT_PUBLIC_FRONTEND}/verification-mail?role=candidat&token=${verificationToken}`,
                  };
                  await transporter.sendMail(mailOptions);

                  res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });                 
                } catch (error) {
                  console.error(error);
                  res.status(500).json({ status: "error", message: 'Failed to create user. Please try again.' });
                }
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
            if (!user.is_verified) {
              res.json({ message: "Adresse mail non vérifée" });
            }
            else if (result && user.is_verified) {
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
        
        if(date_fin === false) {
          const experienceSql = "INSERT INTO experiences (poste, employeur, date_debut, pays, ville) VALUES (?, ?, ?, ?, ?);";
          const [experienceRows, _] = await pool.query(experienceSql, [poste, employeur, date_debut, pays, ville]);
    
          // Get the ID of the last inserted experience
          const experienceId = experienceRows.insertId;
    
          // Insert into exp_candi table to link the experience with the candidate
          const expCandiSql = "INSERT INTO exp_candi (id_candidat, id_experience) VALUES (?, ?);";
          await pool.query(expCandiSql, [id_candidat, experienceId]);
    
          res.json({ status: "success", message: "Experience inserted successfully." });
        } else {
          // Insert into experiences table
          const experienceSql = "INSERT INTO experiences (poste, employeur, date_debut, date_fin, pays, ville) VALUES (?, ?, ?, ?, ?, ?);";
          const [experienceRows, _] = await pool.query(experienceSql, [poste, employeur, date_debut, date_fin, pays, ville]);
    
          // Get the ID of the last inserted experience
          const experienceId = experienceRows.insertId;
    
          // Insert into exp_candi table to link the experience with the candidate
          const expCandiSql = "INSERT INTO exp_candi (id_candidat, id_experience) VALUES (?, ?);";
          await pool.query(expCandiSql, [id_candidat, experienceId]);
    
          res.json({ status: "success", message: "Experience inserted successfully." });
        }
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
        if (date_fin === false) {
          const formationSql = "INSERT INTO formations (nom, ecole, date_debut, pays, ville) VALUES (?, ?, ?, ?, ?);";
          const [formationRows, _] = await pool.query(formationSql, [nom, ecole, date_debut, pays, ville]);
    
          // Get the ID of the last inserted formation
          const formationId = formationRows.insertId;
    
          // Insert into form_candi table to link the formation with the candidate
          const formCandiSql = "INSERT INTO form_candi (id_candidat, id_formation) VALUES (?, ?);";
          await pool.query(formCandiSql, [id_candidat, formationId]);
    
          res.json({ status: "success", message: "Formation inserted successfully." });
        } else {
            // Insert into formations table
            const formationSql = "INSERT INTO formations (nom, ecole, date_debut, date_fin, pays, ville) VALUES (?, ?, ?, ?, ?, ?);";
            const [formationRows, _] = await pool.query(formationSql, [nom, ecole, date_debut, date_fin, pays, ville]);
      
            // Get the ID of the last inserted formation
            const formationId = formationRows.insertId;
      
            // Insert into form_candi table to link the formation with the candidate
            const formCandiSql = "INSERT INTO form_candi (id_candidat, id_formation) VALUES (?, ?);";
            await pool.query(formCandiSql, [id_candidat, formationId]);
      
            res.json({ status: "success", message: "Formation inserted successfully." });
        }
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
            if (date_fin === false) {
              // Update the formation in the formations table
              const sql = `
                  UPDATE formations
                  SET nom = ?, ecole = ?, date_debut = ?, pays = ?, ville = ?
                  WHERE id = ?;
              `;
              await pool.query(sql, [nom, ecole, date_debut, pays, ville, id_formation]);
      
              res.json({ status: "success", message: "Formation updated successfully." });
            } else {
                // Update the formation in the formations table
                const sql = `
                    UPDATE formations
                    SET nom = ?, ecole = ?, date_debut = ?, date_fin = ?, pays = ?, ville = ?
                    WHERE id = ?;
                `;
                await pool.query(sql, [nom, ecole, date_debut, date_fin, pays, ville, id_formation]);
        
                res.json({ status: "success", message: "Formation updated successfully." });
            }
        } catch (error) {
            console.log(error);
            res.json({ status: "error", message: error.message });
        }
    },
    updateExperience: async (req, res) => {
        try {
            const { id_experience, poste, employeur, date_debut, date_fin, pays, ville } = req.body;
            if (date_fin === false) {
                 // Update the experience in the experiences table
                 const sql = `
                 UPDATE experiences
                 SET poste = ?, employeur = ?, date_debut = ?, pays = ?, ville = ?
                 WHERE id = ?;
                `;
                await pool.query(sql, [poste, employeur, date_debut, pays, ville, id_experience]);
        
                res.json({ status: "success", message: "Experience updated successfully." });
            } else {
              // Update the experience in the experiences table
              const sql = `
                  UPDATE experiences
                  SET poste = ?, employeur = ?, date_debut = ?, date_fin = ?, pays = ?, ville = ?
                  WHERE id = ?;
              `;
              await pool.query(sql, [poste, employeur, date_debut, date_fin, pays, ville, id_experience]);
      
              res.json({ status: "success", message: "Experience updated successfully." });
            }
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
    },
    verifMailToken: async (req, res) => {
      const { token } = req.params;
      const vrai = true;
      console.log(token)
      try {
        const sql = 'SELECT * FROM candidats WHERE verification_token = ?';
        const [rows, fields] = await pool.query(sql, [token]);
        const user = rows[0];
        if (!user) {
          return res.status(404).json({ message: 'Invalid or expired verification token' }); console.log('invalid')
        }
    
        // Update user's verification status in the database
        const sql2 = "UPDATE candidats SET is_verified = ? WHERE verification_token = ?;"; // Supposons que vous avez une table 'villes' avec une colonne 'nom'
        const [rows2, fields2] = await pool.query(sql2, [vrai, token]);
    
        res.json({ status: 'success' });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    retryMailToken: async(req, res) => {
      const { mail } = req.params;
      try {
        const sql = 'SELECT verification_token FROM candidats WHERE mail = ?';
        const [rows, fields] = await pool.query(sql, [mail]);

        const mailOptions = {
          from: 'khaledtestdev@hotmail.com',
          to: mail,
          subject: 'Email Verification',
          text: `Click the following link to verify your email: ${process.env.NUXT_PUBLIC_FRONTEND}/verification-mail?role=candidat&token=${rows[0]}`,
        };
        await transporter.sendMail(mailOptions); 

        res.json({data: rows})
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    forgotPass: async(req, res) => {
      const verificationToken = crypto.randomBytes(20).toString('hex');
      const { mail } = req.body;
      try {
        const sqlMail = "SELECT COUNT(*) AS email_count FROM candidats WHERE mail = ?";
        const [rowsMail, fieldsMail] = await pool.query(sqlMail, [mail]);
        const emailCount = rowsMail[0].email_count;

        if (emailCount === 0) {
          res.json({ data: 'mail non existant' });
        } else {
          const sql = 'UPDATE candidats SET verification_token = ? WHERE mail = ?;';
          const [rows, fields] = await pool.query(sql, [verificationToken, mail]);
  
          const mailOptions = {
            from: 'khaledtestdev@hotmail.com',
            to: mail,
            subject: 'Mot de passe oublié',
            text: `Click the following link to change your password: ${process.env.NUXT_PUBLIC_FRONTEND}/pass-change?role=candidat&token=${verificationToken}`,
          };
          await transporter.sendMail(mailOptions); 
  
          res.json({status: "success"})
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    resetPass: async(req, res) => {
      const { pass, token } = req.body;
      bcrypt.hash(pass, 10, async (err, hash) => {
        if (err) throw err; // Handle error from bcrypt.hash
  
        try {
          const sql = "UPDATE candidats SET pass = ? WHERE verification_token = ?";
          await pool.query(sql, [hash, token]);
  
          res.status(200).json({ status: "success", message: 'mot de passe réinitialisé' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ status: "error", message: 'mot de passe non modifié' });
        }
      });
    },
    changeMailRequest: async(req, res) => {
      const verificationToken = crypto.randomBytes(20).toString('hex');
      const { mail } = req.body;
      try {
        const sqlMail = "SELECT COUNT(*) AS email_count FROM candidats WHERE mail = ?";
        const [rowsMail, fieldsMail] = await pool.query(sqlMail, [mail]);
        const emailCount = rowsMail[0].email_count;

        if (emailCount === 0) {
          res.json({ data: 'mail non existant' });
        } else {
          const sql = 'UPDATE candidats SET verification_token = ? WHERE mail = ?;';
          const [rows, fields] = await pool.query(sql, [verificationToken, mail]);
  
          const mailOptions = {
            from: 'khaledtestdev@hotmail.com',
            to: mail,
            subject: 'Modifier mon e-mail',
            text: `Click the following link to change your e-mail: ${process.env.NUXT_PUBLIC_FRONTEND}/mail-change?role=candidat&token=${verificationToken}`,
          };
          await transporter.sendMail(mailOptions); 
  
          res.json({status: "success"})
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    resetMail: async(req, res) => {
      const { mail, token } = req.body;
      const verificationToken = crypto.randomBytes(20).toString('hex');
        try {
          const sqlMail = "SELECT COUNT(*) AS email_count FROM candidats WHERE mail = ?";
          const [rowsMail, fieldsMail] = await pool.query(sqlMail, [mail]);
          const emailCount = rowsMail[0].email_count;

          if (emailCount === 1) {
            res.json({ message: 'Mail existant' });
          } else if (emailCount === 0) {
            const sql = "UPDATE candidats SET mail = ?, is_verified = false WHERE verification_token = ?";
            await pool.query(sql, [mail, token]);
            const sql2 = "UPDATE candidats SET verification_token = ? WHERE mail = ?";
            await pool.query(sql2, [verificationToken, mail]);
  
            const mailOptions = {
              from: 'khaledtestdev@hotmail.com',
              to: mail,
              subject: 'Modifier mon e-mail',
              text: `Click the following link to verify your email: ${process.env.NUXT_PUBLIC_FRONTEND}/verification-mail?role=candidat&token=${verificationToken}`,
            };
            await transporter.sendMail(mailOptions); 
    
            res.status(200).json({ status: "success", message: 'mail réinitialisé' });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ status: "error", message: 'mail non modifié' });
        }
    },
    updateDateNaissance: async (req, res) => {
      try {
        const { date_naissance, id } = req.body;
        const sql = "UPDATE candidats SET date_naissance = ? WHERE id = ?";
        const [rows, fields] = await pool.query(sql, [date_naissance, id]);
        res.json({ status: "success" });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    updatePrenom: async (req, res) => {
      try {
        const { prenom, id } = req.body;
        const sql = "UPDATE candidats SET prenom = ? WHERE id = ?";
        const [rows, fields] = await pool.query(sql, [prenom, id]);
        res.json({ status: "success" });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    updatePhone: async (req, res) => {
      try {
        const { phone, id } = req.body;
        const sql2 = "SELECT COUNT(*) AS phone_count FROM candidats WHERE phone = ?";
        const [rows2, fields2] = await pool.query(sql2, [phone]);
        const phoneCount = rows2[0].phone_count;
        if (phoneCount > 0){
          res.json({ message: 'téléphone existant' });
        } else {
          const sql = "UPDATE candidats SET phone = ? WHERE id = ?";
          const [rows, fields] = await pool.query(sql, [phone, id]);
          res.json({ status: "success" });
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    updateNom: async (req, res) => {
      try {
        const { nom, id } = req.body;
        const sql = "UPDATE candidats SET nom = ? WHERE id = ?";
        const [rows, fields] = await pool.query(sql, [nom, id]);
        res.json({ status: "success" });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    deleteCandidat: async (req, res) => {
      try {
        const { id } = req.body;
    
        // Supprimer les candidatures associées à ce candidat
        const sqlDeleteApplications = "DELETE FROM candidatures WHERE id_candidat = ?";
        await pool.query(sqlDeleteApplications, [id]);
    
        // Supprimer les compétences associées à ce candidat
        const sqlDeleteSkills = "DELETE FROM comp_candi WHERE id_candidat = ?";
        await pool.query(sqlDeleteSkills, [id]);
    
        // Supprimer les expériences associées à ce candidat
        const sqlDeleteExperiences = "DELETE FROM exp_candi WHERE id_candidat = ?";
        await pool.query(sqlDeleteExperiences, [id]);
    
        // Supprimer les formations associées à ce candidat
        const sqlDeleteFormations = "DELETE FROM form_candi WHERE id_candidat = ?";
        await pool.query(sqlDeleteFormations, [id]);
    
        // Supprimer le candidat
        const sqlDeleteCandidate = "DELETE FROM candidats WHERE id = ?";
        await pool.query(sqlDeleteCandidate, [id]);
    
        res.status(200).json({ status: "success", message: "Candidat et données associées supprimés avec succès." });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Erreur lors de la suppression du candidat et des données associées." });
      }
    }
    
  };
  
  module.exports = candidatsController;
  