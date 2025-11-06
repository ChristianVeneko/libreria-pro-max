const express = require('express');
const cors = require('cors');
const bodyparser = require('body-parser');
const connection = require('./config/db');
require('dotenv').config();

const app = express();

//middelewares
app.use(cors());
app.use(bodyparser.json());

app.get('/', (req, res) => {
    res.send('Welcome to the Library API');
})




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});