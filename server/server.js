const express = require('express');
const cors = require('cors'); 

const app = express();
app.use(express.json());
const port = 5000;

app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`));
app.use(cors());

const { Pool } = require('pg');


const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Calila00123',
  port: 5432
});

app.get('/posts', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts');
    res.json(rows);
    console.log(`Consulta realizada con éxito en puerto ${port}`);
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

pool.connect((error) => {
    if (error) {
      console.error('Error de conexión a la base de datos:', error);
    } else {    
      console.log('Conexión exitosa a la base de datos');
    }
});

app.post('/posts', async (req, res) => {
    const { titulo, url, descripcion } = req.body;
  
    if (!titulo || !url || !descripcion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    } 
    try {
      const query = 'INSERT INTO posts (titulo, url, descripcion) VALUES ($1, $2, $3) RETURNING *';
      const values = [titulo, url, descripcion];
      const { rows } = await pool.query(query, values);
      res.json(rows[0]);
    } catch (error) {
      console.error('Error al insertar el registro:', error);
      res.status(500).json({ error: 'Error interno del servidor al insertar el post.' });
    }
  });
  
  