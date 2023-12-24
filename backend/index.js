const express = require('express');
const app = express();
var cors = require('cors')
app.use(express.json());

require('dotenv').config()

app.use(cors())

app.options('*', cors())

const annoncesRouter = require('./routes/annonces.router');
const competencesRouter = require('./routes/competences.router');
const candidatsRouter = require('./routes/candidats.router');
const employeursRouter = require('./routes/employeurs.router');

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use("/api/v1/annonces", annoncesRouter);
app.use("/api/v1/competences", competencesRouter);
app.use("/api/v1/candidats", candidatsRouter);
app.use("/api/v1/employeurs", employeursRouter);
app.get('/', (req, res) => res.json('Salut Khaled'))

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("Server running on port 3001");
})