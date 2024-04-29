const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const cors = require('cors');
  
const app = express();
const port = 3000;
  
/* MySQL Connection */
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'asignatura'
});
  
/* Connect to MySQL */
db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL');
});

/* Middleware */
app.use(bodyParser.json());
app.use(cors());

/* Routes */
/* Listar todas las Asignaturas */
app.get('/posts', (req, res) => {
  db.query('SELECT * FROM crear', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching posts');
      return;
    }
    res.json(results);
  });
});

/* Crear asignatura */
app.post('/posts/create', (req, res) => {
  const { idAsignatura, Nombre, TipoAsignatura, NumeroAlumnos, Horas, Estado } = req.body;
  db.query('INSERT INTO crear (idAsignatura, Nombre, TipoAsignatura, NumeroAlumnos, Horas, Estado) VALUES (?,?,?,?,?,?)', [idAsignatura, Nombre, TipoAsignatura, NumeroAlumnos, Horas, "Activo"], (err, result) => {
    if (err) {
      res.status(500).send('Error creating post');
      return;
    }
    res.status(201).json(req.body);
  });
});

/* Visualizar asignatura */
app.get('/posts/:id', (req, res) => {
  const postId = req.params.id;
  db.query('SELECT * FROM crear WHERE idAsignatura =?', [postId], (err, result) => {
    if (err) {
      res.status(500).send('Error fetching post');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Post not found');
      return;
    }
    res.json(result[0]);
  });
});

/* Actualizar una asignatura */
app.put('/posts/:id', (req, res) => {
  const postId = req.params.id;
  const { idAsignatura, Nombre, TipoAsignatura, NumeroAlumnos, Horas, Estado } = req.body;
  db.query('UPDATE crear SET Nombre =?, TipoAsignatura =?, NumeroAlumnos =?, Horas = ?, Estado = ? WHERE idAsignatura =?', [Nombre, TipoAsignatura, NumeroAlumnos, Horas, Estado, postId], err => {
    if (err) {
      res.status(500).send('Error updating post');
      return;
    }
    db.query('SELECT * FROM crear WHERE idAsignatura =?', postId, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching updated post');
        return;
      }
      res.json(result[0]);
    });
  });
});


/* Iniciar coneccion */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});