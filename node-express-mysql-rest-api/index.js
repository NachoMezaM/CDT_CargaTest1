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


    }
    res.json(results);
  });
});

app.get('/profesor/', (req, res) => {
  db.query('SELECT * FROM cargaacademica.Profesor', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching posts');
      return;
    }
    res.json(results);
  });
});
  // -------------------------------------------------------------------------Profesor-------------------------------------------------------------------------
/* Crear un nuevo profesor */
app.post('/profesor/crear-profe', (req, res) => {
  const { idProfesor, Nombre, Tipo, Profesion, Horas, ValorHora, idJerarquia, Direccion, Telefono, Grado, TituloGrado, Estado, Apellido } = req.body;
    // Si no existe, insertar el nuevo profesor en la base de datos
    db.query('INSERT INTO cargaacademica.Profesor (idProfesor, Nombre, Tipo, Profesion, Horas, ValorHora, idJerarquia, Direccion, Telefono, Grado, TituloGrado, Estado, Apellido) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [idProfesor, Nombre, Tipo, Profesion, Horas, ValorHora, idJerarquia, Direccion, Telefono, Grado, TituloGrado, Estado, Apellido], 
      (err, result) => {
        if (err) {
          console.error('Error al crear Profesor:', err);
          return res.status(500).send('Error al crear Profesor');
        }
        
        const nuevoProfesorId = result.insertId;

        // Obtener los datos del profesor recién creado
        db.query('SELECT * FROM cargaacademica.Profesor WHERE idProfesor = ?', nuevoProfesorId, (err, result) => {
          if (err) {
            console.error('Error al obtener el Profesor creado:', err);
            return res.status(500).send('Error al obtener el Profesor creado');
          }
          res.status(201).json(result[0]);
        });
      }
    );
  });



/* Get a specific post */
app.get('/profesor/:idProfesor', (req, res) => {
  const profesoridProfesor = req.params.idProfesor;
  db.query('SELECT * FROM cargaacademica.Profesor WHERE idProfesor = ?', profesoridProfesor, (err, result) => {
    if (err) {
      res.status(500).send('Error fetching Profesor');
      return;
    }
    if (result.length === 0) {
      res.status(404).send('Profesor not found');
      return;
    }
    res.json(result[0]);
  });
});
  
 //Update a post 
app.put('/profesor/:idProfesor', (req, res) => {
  
  const profesoridProfesor = req.params.idProfesor;
  console.log("Funca")
  const { Nombre,Tipo, Profesion, Horas, ValorHora, idJerarquia, Direccion, Telefono, Grado, TituloGrado, Estado, Apellido} = req.body;
  db.query('UPDATE cargaacademica.Profesor SET Nombre=? ,Tipo = ?, Profesion = ?, Horas = ?, ValorHora = ?, idJerarquia = ?, Direccion = ?, Telefono = ?, Grado = ?, TituloGrado = ?, Estado = ?, Apellido = ? WHERE idProfesor = ?'
  , [Nombre,Tipo, Profesion, Horas, ValorHora, idJerarquia, Direccion, Telefono, Grado, TituloGrado, Estado, Apellido,profesoridProfesor], err => {
    if (err) {
      res.status(500).send('Error updating Profesor');
      return;
    }
    db.query('SELECT * FROM cargaacademica.Profesor WHERE idProfesor = ?', profesoridProfesor, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching updated Profesor');
        return;
      }
      res.json(result[0]);
    });
  });
});

 //Delete a post 
app.delete('/asignatura/id', (req, res) => {
  console.log('Connected to MySQL');
  const postId = req.params.id;
  db.query('DELETE FROM cargaacademica.Profesor WHERE id = ?', postId, err => {
    if (err) {
      res.status(500).send('Error deleting post');
      return;
    }
    res.status(200).json({ msg: 'Post deleted successfully' });
  });
});

/* Start server */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});