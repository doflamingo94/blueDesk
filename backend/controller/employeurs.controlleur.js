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
        const { nom, numero_siret, pass, identifiant, phone, mail, ville } = req.body;
        const verificationToken = crypto.randomBytes(20).toString('hex');
    
        const sqlMail = "SELECT COUNT(*) AS email_count FROM employeurs WHERE mail = ?";
        const [rowsMail, fieldsMail] = await pool.query(sqlMail, [mail]);
        const emailCount = rowsMail[0].email_count;
    
        const sqlIdentifiant = "SELECT COUNT(*) AS identifiant_count FROM employeurs WHERE identifiant = ?";
        const [rowsIdentifiant, fieldsIdentifiant] = await pool.query(sqlIdentifiant, [identifiant]);
        const identifiantCount = rowsIdentifiant[0].identifiant_count;
    
        const sqlNumeroSiret = "SELECT COUNT(*) AS numero_siret_count FROM employeurs WHERE numero_siret = ?";
        const [rowsNumeroSiret, fieldsNumeroSiret] = await pool.query(sqlNumeroSiret, [numero_siret]);
        const numeroSiretCount = rowsNumeroSiret[0].numero_siret_count;

        const sqlNom = "SELECT COUNT(*) AS nom_count FROM employeurs WHERE nom = ?";
        const [rowsNom, fieldsNom] = await pool.query(sqlNom, [nom]);
        const nomCount = rowsNom[0].nom_count;
    
        if (emailCount > 0) {
          res.json({ data: 'mail existant' });
        } else if (identifiantCount > 0) {
          res.json({ data: 'identifiant existant' });
        } else if (numeroSiretCount > 0) {
          res.json({ data: 'numero_siret existant' });
        } else if (nomCount > 0) {
          res.json({ data: 'nom existant' });
        } else {

          bcrypt.hash(pass, 10, async (err, hash) => {
            if (err) throw err; // Handle error from bcrypt.hash
      
            try {
              const sql = "INSERT INTO employeurs (nom, numero_siret, pass, identifiant, phone, mail, date_creation, ville, verification_token, is_verified) VALUES (?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?)";
              await pool.query(sql, [nom, numero_siret, hash, identifiant, phone, mail, ville, verificationToken, false]);
      
              const mailOptions = {
                from: 'khaledtestdev@hotmail.com',
                to: mail,
                subject: 'Email Verification',
                text: `Click the following link to verify your email: ${process.env.NUXT_PUBLIC_FRONTEND}/verification-mail?role=employeur&token=${verificationToken}`,
              };
              await transporter.sendMail(mailOptions);
      
              res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });
            } catch (error) {
              console.error(error);
              res.status(500).json({ status: "error", message: 'Failed to create user. Please try again.' });
            }
          });
        }
    
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
            const result = await bcrypt.compare(pass, user.pass);
            if (!user.is_verified) {
              res.json({ status: "error", message: "Adresse mail non vérifée" });
            }
            else if (result) {
              const userId = user.id;
              const role = 'employeur';
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
        console.error(error);
        res.json({ status: "error", message: error.message });
      }
    },
    mesAnnonces: async (req, res) => {
      try {
        const { id_employeur } = req.body; 
    
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
        const { id_employeur, id_annonce } = req.body;
    
        const deleteCandidaturesSQL = 'DELETE FROM candidatures WHERE id_annonce = ?;';
        await pool.query(deleteCandidaturesSQL, [id_annonce]);

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
    },
    updateLogo: async (req, res) => {
      try {
        const { url_logo, id } = req.body;
        const sql = "UPDATE employeurs SET url_logo = ? WHERE id = ?";
        const [rows, fields] = await pool.query(sql, [url_logo, id]);
        res.json({ data: rows });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    insertSecteur: async (req, res) => {
      try {
          const { secteur, id } = req.body; // Supposons que le nom du secteur est fourni dans le corps de la requête

          // Assurez-vous de valider les données d'abord si nécessaire

          const sql = "UPDATE employeurs SET secteur = ? WHERE id = ?;"; // Supposons que vous avez une table 'secteurs' avec une colonne 'nom'
          const [rows, fields] = await pool.query(sql, [secteur, id]);
          res.json({ status: "success", message: "Secteur ajouté avec succès" });
      } catch (error) {
          console.error(error);
          res.json({ status: "error", message: error.message });
      }
    },
    insertDescription: async (req, res) => {
      try {
          const { description, id } = req.body; // Supposons que la description est fournie dans le corps de la requête

          // Assurez-vous de valider les données d'abord si nécessaire

          const sql = "UPDATE employeurs SET description = ? WHERE id = ?;"; // Supposons que vous avez une table 'descriptions' avec une colonne 'description'
          const [rows, fields] = await pool.query(sql, [description, id]);
          res.json({ status: "success", message: "Description ajoutée avec succès" });
      } catch (error) {
          console.error(error);
          res.json({ status: "error", message: error.message });
      }
    },
    insertVille: async (req, res) => {
      try {
          const { ville, id } = req.body; // Supposons que le nom de la ville est fourni dans le corps de la requête

          // Assurez-vous de valider les données d'abord si nécessaire

          const sql = "UPDATE employeurs SET ville = ? WHERE id = ?;"; // Supposons que vous avez une table 'villes' avec une colonne 'nom'
          const [rows, fields] = await pool.query(sql, [ville, id]);
          res.json({ status: "success", message: "Ville ajoutée avec succès" });
      } catch (error) {
          console.error(error);
          res.json({ status: "error", message: error.message });
      }
    },
    getProfil: async (req, res) => {
      try {
        const { nom } = req.params;
        const sql = "SELECT nom, url_logo, ville, secteur, description FROM employeurs WHERE nom = ?";
        const [rows, fields] = await pool.query(sql, [nom]);
        res.json({ data: rows });
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
        const sql = 'SELECT * FROM employeurs WHERE verification_token = ?';
        const [rows, fields] = await pool.query(sql, [token]);
        const user = rows[0];
        if (!user) {
          return res.status(404).json({ message: 'Invalid or expired verification token' }); console.log('invalid')
        }
    
        // Update user's verification status in the database
        const sql2 = "UPDATE employeurs SET is_verified = ? WHERE verification_token = ?;"; // Supposons que vous avez une table 'villes' avec une colonne 'nom'
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
        const sql = 'SELECT verification_token FROM employeurs WHERE mail = ?';
        const [rows, fields] = await pool.query(sql, [mail]);

        const mailOptions = {
          from: 'khaledtestdev@hotmail.com',
          to: mail,
          subject: 'Email Verification',
          text: `Click the following link to verify your email: ${process.env.NUXT_PUBLIC_FRONTEND}/verification-mail?role=employeur&token=${rows[0]}`,
        };
        await transporter.sendMail(mailOptions);

        res.json({data: rows})
      } catch (error) {
 
      }
    },
    forgotPass: async(req, res) => {
      const verificationToken = crypto.randomBytes(20).toString('hex');
      const { mail } = req.body;
      try {
        const sqlMail = "SELECT COUNT(*) AS email_count FROM employeurs WHERE mail = ?";
        const [rowsMail, fieldsMail] = await pool.query(sqlMail, [mail]);
        const emailCount = rowsMail[0].email_count;

        if (emailCount === 0) {
          res.json({ data: 'mail non existant' });
        } else {
          const sql = 'UPDATE employeurs SET verification_token = ? WHERE mail = ?;';
          const [rows, fields] = await pool.query(sql, [verificationToken, mail]);
  
          const mailOptions = {
            from: 'khaledtestdev@hotmail.com',
            to: mail,
            subject: 'Mot de passe oublié',
            text: `Click the following link to change your password: ${process.env.NUXT_PUBLIC_FRONTEND}/pass-change?role=employeur&token=${verificationToken}`,
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
          const sql = "UPDATE employeurs SET pass = ? WHERE verification_token = ?";
          await pool.query(sql, [hash, token]);
  
          res.status(200).json({ status: "success", message: 'mot de passe réinitialisé' });
        } catch (error) {
          console.error(error);
          res.status(500).json({ status: "error", message: 'Failed to create user. Please try again.' });
        }
      });
    },
    changeMailRequest: async(req, res) => {
      const verificationToken = crypto.randomBytes(20).toString('hex');
      const { mail } = req.body;
      try {
        const sqlMail = "SELECT COUNT(*) AS email_count FROM employeurs WHERE mail = ?";
        const [rowsMail, fieldsMail] = await pool.query(sqlMail, [mail]);
        const emailCount = rowsMail[0].email_count;

        if (emailCount === 0) {
          res.json({ data: 'mail non existant' });
        } else {
          const sql = 'UPDATE employeurs SET verification_token = ? WHERE mail = ?;';
          const [rows, fields] = await pool.query(sql, [verificationToken, mail]);
  
          const mailOptions = {
            from: 'khaledtestdev@hotmail.com',
            to: mail,
            subject: 'Modifier mon e-mail',
            text: `Click the following link to change your e-mail: ${process.env.NUXT_PUBLIC_FRONTEND}/mail-change?role=employeur&token=${verificationToken}`,
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
          const sqlMail = "SELECT COUNT(*) AS email_count FROM employeurs WHERE mail = ?";
          const [rowsMail, fieldsMail] = await pool.query(sqlMail, [mail]);
          const emailCount = rowsMail[0].email_count;

          if (emailCount > 0) {
            res.json({ message: 'Mail existant' });
          } else {
            const sql = "UPDATE employeurs SET mail = ?, is_verified = false WHERE verification_token = ?";
            await pool.query(sql, [mail, token]);
            const sql2 = "UPDATE employeurs SET verification_token = ? WHERE mail = ?";
            await pool.query(sql2, [verificationToken, mail]);
  
            const mailOptions = {
              from: 'khaledtestdev@hotmail.com',
              to: mail,
              subject: 'Modifier mon e-mail',
              text: `Click the following link to verify your email: ${process.env.NUXT_PUBLIC_FRONTEND}/verification-mail?role=employeur&token=${verificationToken}`,
            };
            await transporter.sendMail(mailOptions); 
    
            res.status(200).json({ status: "success", message: 'mail réinitialisé' });
          }
        } catch (error) {
          console.error(error);
          res.status(500).json({ status: "error", message: 'mail non modifié' });
        }
    },
    updatePhone: async (req, res) => {
      try {
        const { phone, id } = req.body;
        const sql = "UPDATE employeurs SET phone = ? WHERE id = ?";
        const [rows, fields] = await pool.query(sql, [phone, id]);
        res.json({ status: "success" });
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    updateNom: async (req, res) => {
      try {
        const { nom, id } = req.body;
        const sqlNom = "SELECT COUNT(*) AS nom_count FROM employeurs WHERE nom = ?";
        const [rowsNom, fieldsNom] = await pool.query(sqlNom, [nom]);
        const nomCount = rowsNom[0].nom_count;

        if (nomCount > 0) {
          res.json({ message: 'nom existant' });
        } else {
          const sql = "UPDATE employeurs SET nom = ? WHERE id = ?";
          const [rows, fields] = await pool.query(sql, [nom, id]);
          res.json({ status: "success" });
        }
      } catch (error) {
        console.log(error);
        res.json({ status: "error", message: error.message });
      }
    },
    deleteEmployeur: async (req, res) => {
      try {
        const { id } = req.body;
    
        // Vérifier s'il existe des annonces liées à cet employeur
        const sqlCheckAnnouncements = "SELECT id FROM annonces WHERE id_employeur = ?";
        const [announcementRows] = await pool.query(sqlCheckAnnouncements, [id]);
        
        // Supprimer toutes les candidatures associées aux annonces
        for (const announcement of announcementRows) {
          const sqlDeleteApplications = "DELETE FROM candidatures WHERE id_annonce = ?";
          await pool.query(sqlDeleteApplications, [announcement.id]);
        }
    
        // Supprimer les annonces associées à cet employeur
        const sqlDeleteAnnouncements = "DELETE FROM annonces WHERE id_employeur = ?";
        await pool.query(sqlDeleteAnnouncements, [id]);
    
        // Supprimer l'employeur
        const sqlDeleteEmployer = "DELETE FROM employeurs WHERE id = ?";
        await pool.query(sqlDeleteEmployer, [id]);
    
        res.status(200).json({ status: "success", message: "Employeur et données associées supprimés avec succès." });
      } catch (error) {
        console.error(error);
        res.status(500).json({ status: "error", message: "Erreur lors de la suppression de l'employeur et des données associées." });
      }
    }
    
  };
  
  module.exports = employeursController;

