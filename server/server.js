const express = require('express');
const cors = require('cors'); 
const multer = require('multer');
const fs = require('fs');
const { Pool } = require('pg');

const app = express();
const port = 5000;

// middlewares
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.listen(port, () => console.log(`Servidor escuchando en el puerto ${port}`));

pool.connect((error) => {
  if (error) {
    console.error('Error de conexión a la base de datos:', error);
  } else {    
    console.log('Conexión exitosa a la base de datos');
  }
});

// Configuración de multer para cargar la imagen
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '_' + file.originalname);
  }
});
const upload = multer({ storage: storage }).single('img');

// Configuración de la base de datos
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'password',
  port: 5432
});

app.get('/posts', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM posts'); // rows: es un arreglo de objetos con los registros de la tabla posts
    res.json(rows);
    console.log(`Consulta realizada con éxito en puerto ${port}`); // mensaje para el servidor
  } catch (error) {
    console.error('Error al obtener los registros:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});


app.post('/posts', (req, res) => {
  // Para el método post se usa la función upload de multer para cargar la imagen
  upload(req, res, async (err) => { 
      if (err) {
      return res.status(500).json({ error: 'Error al cargar la imagen.' });
    }
    const { titulo, descripcion } = req.body; // Obtener los datos del formulario
    const imgPath = req.file.path; // req.file.path es la ruta de la imagen en el servidor
    if (!titulo || !imgPath || !descripcion) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }
    try {
      const query = 'INSERT INTO posts (titulo, url, descripcion) VALUES ($1, $2, $3) RETURNING *';
      const values = [titulo, imgPath, descripcion]; // 
      const { rows } = await pool.query(query, values); 
      res.json(rows[0]); // si todo sale bien, devolver el primer registro insertado
      console.log(`Post insertado con éxito en puerto ${port}`);
    } catch (error) {
      console.error('Error al insertar el registro:', error); // mensaje para el servidor
      res.status(500).json({ error: 'Error interno del servidor al insertar el post.' }); // mensaje para el cliente
    }
  });
});
  
app.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Obtener la información de la imagen antes de eliminar el post de la base de datos
    const { rows } = await pool.query('SELECT url FROM posts WHERE id = $1', [id]);
    if (rows.length === 0) { // si el largo del arreglo es 0, responder con un error
      return res.status(404).json({ error: 'No se encontró el post.' });
    }
    const imgPath = rows[0].url; // se obtiene el primer registro del arreglo y se accede a la propiedad url
    await pool.query('DELETE FROM posts WHERE id = $1', [id]); // Eliminar el post de la base de datos
    fs.unlinkSync(imgPath);    // Eliminar la imagen del servidor
    res.json({ message: 'Post eliminado con éxito.' }); // mensaje para el cliente
    console.log(`Post eliminado con éxito en puerto ${port}`); // mensaje para el servidor
  } catch (error) {
    console.error('Error al eliminar el post:', error);
    res.status(500).json({ message: 'Error interno del servidor al eliminar el post.', error });
  }
});

app.put('/posts/like/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { rows } = await pool.query('SELECT likes FROM posts WHERE id = $1', [id]); 
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró el post.' });
    }
    const likes = rows[0].likes + 1; // Incrementar el número de likes en 1 cuando se haga un PUT
    await pool.query('UPDATE posts SET likes = $1 WHERE id = $2', [likes, id]); 
    res.json({ message: 'Like agregado con éxito.' }); 
    console.log(`Like agregado con éxito en puerto ${port}`);
  } catch (error) {
    console.error('Error al agregar el like:', error);
    res.status(500).json({ message: 'Error interno del servidor al agregar el like.', error });
  }
});