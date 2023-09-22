const express = require('express');
const cors = require('cors'); 
const multer = require('multer');
const fs = require('fs');

const app = express();
app.use(express.json());
const port = 5000;

app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`));
app.use(cors());
app.use('/uploads', express.static('uploads'));

const { Pool } = require('pg');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});

const upload = multer({ storage: storage }).single('img');

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

app.post('/posts', (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).json({ error: 'Error al cargar la imagen.' });
    }

    const { titulo, descripcion } = req.body;
    const imgPath = req.file.path;

    if (!titulo || !imgPath || !descripcion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
      const query = 'INSERT INTO posts (titulo, url, descripcion) VALUES ($1, $2, $3) RETURNING *';
      const values = [titulo, imgPath, descripcion];
      const { rows } = await pool.query(query, values);
      res.json(rows[0]);
    } catch (error) {
      console.error('Error al insertar el registro:', error);
      res.status(500).json({ error: 'Error interno del servidor al insertar el post.' });
    }
  });
});
  
  app.delete('/posts/:id', async (req, res) => {
    try {
      const {id} = req.params;
      const connection = await pool.connect();
      const {rows} = await connection.query('DELETE FROM posts WHERE id = $1', [id]);
      if(rows.length === 0) {
        return res.status(404).json({error: 'No se encontró el post.'});
      }
      const imgPath = rows[0].url;
      res.json({message: 'Post eliminado con éxito.'});
      fs.unlinkSync(imgPath, async (error) => {
        if(error) {
          console.log(error);
          return res.status(500).json({message: 'Error interno del servidor al eliminar la imagen.'});
        }
        const sql = 'DELETE FROM posts WHERE id = $1';
        const values = [id];
        await connection.query(sql, values);
        res.json({message: 'Post eliminado con éxito.'});
      });
      connection.release();
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error interno del servidor al eliminar el post.', error });
      };
  });
  