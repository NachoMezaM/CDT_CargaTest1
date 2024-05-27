const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 3000;

/* MySQL Connection */
const db = mysql.createConnection({
  host: "144.22.57.157", //host de la base de datos
  user: "cargaacademica",
  password: "Carga2024-",
  database: "cargaacademica",
});

/* Connect to MySQL */
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("Connected to MySQL");
});

/* Middleware */
app.use(bodyParser.json());
app.use(cors());

/* Listar todas las Asignaturas */
app.get("/posts", (req, res) => {
  db.query("SELECT * FROM cargaacademica.Asignatura", (err, results) => {
    if (err) {
      res.status(500).send("Error fetching posts");
      return;
    }
    res.json(results);
  });
});
//Listar todos los Profesores 
app.get("/profesor/", (req, res) => {
  db.query("SELECT * FROM cargaacademica.Profesor", (err, results) => {
    if (err) {
      res.status(500).send("Error fetching posts");
      return;
    }
    res.json(results);
  });
});
app.get("/seccion/", (req, res) => {
  
  db.query("SELECT * FROM cargaacademica.AsignaturaSeccion", (err, results) => {
    if (err) {
      res.status(500).send("Error fetching posts");
      return;
    }
    res.json(results);
    console.log(results)
  });
});
/* --------------------------------------------------------------------- Asignaturas  ---------------------------------------------------------------------*/

/* Crear asignatura */
app.post("/posts/create", (req, res) => {
  const { idAsignatura, Nombre, Horas, NumeroAlumnos, Estado, TipoAsignatura, idPlanAcademico } =
    req.body;

  db.query(
    "INSERT INTO cargaacademica.Asignatura (idAsignatura, Nombre, Horas, NumeroAlumnos, Estado, TipoAsignatura, idPlanAcademico) VALUES (?,?,?,?,?,?,?)",
    [idAsignatura, Nombre, Horas, NumeroAlumnos, "Activo", TipoAsignatura, idPlanAcademico],
    (err, result) => {
      if (err) {
        res.status(500).send("Error creating cargaacademica.Asignatura");
        return;
      }
      res.status(201).json(req.body);
    }
  );
});

/* Visualizar asignatura */
app.get("/posts/:id", (req, res) => {
  const postId = req.params.id;
  db.query(
    "SELECT * FROM cargaacademica.Asignatura WHERE idAsignatura =?",
    [postId],
    (err, result) => {
      if (err) {
        res.status(500).send("Error fetching post");
        return;
      }
      if (result.length === 0) {
        res.status(404).send("Post not found");
        return;
      }
      res.json(result[0]);
    }
  );
});

/* Actualizar una asignatura */
app.put("/posts/:id", (req, res) => {
  const postId = req.params.id;
  const { idAsignatura, Nombre, TipoAsignatura, NumeroAlumnos, Horas, Estado } =
    req.body;
  db.query(
    "UPDATE cargaacademica.Asignatura SET idAsignatura=?, Nombre =?, TipoAsignatura =?, NumeroAlumnos =?, Horas = ?, Estado = ? WHERE idAsignatura =?",
    [idAsignatura, Nombre, TipoAsignatura, NumeroAlumnos, Horas, Estado, postId],
    (err) => {
      if (err) {
        res.status(500).send("Error updating post");
        return;
      }
      db.query(
        "SELECT * FROM cargaacademica.Asignatura WHERE idAsignatura =?",
        postId,
        (err, result) => {
          if (err) {
            res.status(500).send("Error fetching updated post");
            return;
          }
          res.json(result[0]);
        }
      );
    }
  );
});



/* SECCION MANDAR */
//-------------------------------------------------------------------------------------------------------------------//
app.post("/posts/seccion", (req, res) => {
  const hola= { url, Semestre, carreraValor, idAsignatura } =
    req.body;
console.log("Funca")
  db.query(
    "INSERT INTO cargaacademica.AsignaturaSeccion (idAsignaturaSeccion, Semestre, idSeccion, idAsignatura) VALUES (?,?,?,?)",
    [url, Semestre, carreraValor, idAsignatura],
    (err, result) => {
      if (err) {
        res.status(500).send("Error creating cargaacademica.AsignaturaSeccion");
        return;
      }
      res.status(201).json(req.body);
    }
    
  );
});
// -------------------------------------------------------------------------Profesor-------------------------------------------------------------------------
/* Crear un nuevo profesor */
app.post("/profesor/crear-profe", (req, res) => {
  const {
    idProfesor, Nombre, Tipo, Profesion, Horas, ValorHora, idJerarquia, Direccion, Telefono, Grado, TituloGrado, Estado, Apellido } = req.body;
  // Si no existe, insertar el nuevo profesor en la base de datos
  db.query(
    "INSERT INTO cargaacademica.Profesor (idProfesor, Nombre, Tipo, Profesion, Horas, ValorHora, idJerarquia, Direccion, Telefono, Grado, TituloGrado, Estado, Apellido) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [idProfesor, Nombre, Tipo, Profesion, Horas, ValorHora, idJerarquia, Direccion, Telefono, Grado, TituloGrado, Estado, Apellido],
    (err, result) => {
      if (err) {
        console.error("Error al crear Profesor:", err);
        return res.status(500).send("Error al crear Profesor");
      }

      const nuevoProfesorId = result.insertId;

      // Obtener los datos del profesor recién creado
      db.query(
        "SELECT * FROM cargaacademica.Profesor WHERE idProfesor = ?",
        nuevoProfesorId,
        (err, result) => {
          if (err) {
            console.error("Error al obtener el Profesor creado:", err);
            return res.status(500).send("Error al obtener el Profesor creado");
          }
          res.status(201).json(result[0]);
        }
      );
    }
  );
});

/* Get a specific post */
app.get("/profesor/:idProfesor", (req, res) => {
  const profesoridProfesor = req.params.idProfesor;
  db.query(
    "SELECT * FROM cargaacademica.Profesor WHERE idProfesor = ?",
    profesoridProfesor,
    (err, result) => {
      if (err) {
        res.status(500).send("Error fetching Profesor");
        return;
      }
      if (result.length === 0) {
        res.status(404).send("Profesor not found");
        return;
      }
      res.json(result[0]);
    }
  );
});

//Update a post
app.put("/profesor/:idProfesor", (req, res) => {
  const profesoridProfesor = req.params.idProfesor;
  console.log("Funca");
  const { Nombre, Tipo, Profesion, Horas, ValorHora, idJerarquia, Direccion, Telefono, Grado, TituloGrado, Estado, Apellido } = req.body;
  db.query(
    "UPDATE cargaacademica.Profesor SET Nombre=? ,Tipo = ?, Profesion = ?, Horas = ?, ValorHora = ?, idJerarquia = ?, Direccion = ?, Telefono = ?, Grado = ?, TituloGrado = ?, Estado = ?, Apellido = ? WHERE idProfesor = ?",
    [Nombre, Tipo, Profesion, Horas, ValorHora, idJerarquia, Direccion, Telefono, Grado, TituloGrado, Estado, Apellido, profesoridProfesor],
    (err) => {
      if (err) {
        res.status(500).send("Error updating Profesor");
        return;
      }
      db.query(
        "SELECT * FROM cargaacademica.Profesor WHERE idProfesor = ?",
        profesoridProfesor,
        (err, result) => {
          if (err) {
            res.status(500).send("Error fetching updated Profesor");
            return;
          }
          res.json(result[0]);
        }
      );
    }
  );
});
// Ruta para buscar los datos en la base de datos
app.post("/buscar-datos", (req, res) => {
  const { rut, nombre, año } = req.body;

  // Realizar la consulta en la base de datos, uniendo con la tabla de jerarquías para obtener el nombre de la jerarquía
  const query = `
    SELECT Profesor.*
    FROM Profesor
    JOIN Jerarquia ON Profesor.idJerarquia = Jerarquia.idJerarquia
    WHERE CONCAT(Profesor.Nombre, ' ', Profesor.Apellido) LIKE ? OR Profesor.idProfesor = ?
  `;
  console.log(query);
  const values = [`%${nombre}%`, rut];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al buscar datos:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }
    console.log("Datos encontrados:", result);
    res.status(200).json(result);
  });
});

// Ruta para obtener las hora máximas de docencia desde la tabla jerarquia
app.get("/obtener-hora-maxima-docencia/:idJerarquia", (req, res) => {
  const idJerarquia = req.params.idJerarquia;

  // Realizar la consulta en la base de datos para obtener las horas máximas de docencia
  const query = `
    SELECT horaMaximaDeDocencia
    FROM Jerarquia
    WHERE idJerarquia = ?
  `;
  const values = [idJerarquia];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al obtener las horas máximas de docencia:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }

    if (result && result.length > 0) {
      const horaMaximaDeDocencia = result[0].horaMaximaDeDocencia;
      res.status(200).json({ horaMaximaDeDocencia });
    } else {
      console.error("No se encontraron las horas máximas de docencia.");
      res.status(404).send("No se encontraron las horas máximas de docencia");
    }
  });
});

//Docencia Directa

// Ruta para obtener las secciones disponibles para un código de asignatura
app.post("/obtener-secciones", (req, res) => {
  const codigo = req.body.codigo;

  // Consulta para obtener las secciones disponibles para el código de asignatura proporcionado
  const query = `
    SELECT idSeccion
    FROM AsignaturaSeccion
    WHERE idAsignatura = ? 
  `;
  const values = [codigo];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al obtener secciones:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }

    res.status(200).json(result);
  });
});

// Ruta para obtener los detalles de una asignatura según el código y la sección
app.get("/detalles-asignatura/:codigo/:seccion", (req, res) => {
  const codigo = req.params.codigo;
  const seccion = req.params.seccion;

  // Consulta para obtener los detalles de la asignatura según el código y la sección proporcionados,
  // incluyendo el nombre y la hora de la asignatura
  const query = `
    SELECT Asignatura.Nombre AS nombre, Asignatura.Horas AS hora,
           AsignaturaSeccion.*, Asignatura.*
    FROM AsignaturaSeccion
    JOIN Asignatura ON AsignaturaSeccion.idAsignatura = Asignatura.idAsignatura
    WHERE AsignaturaSeccion.idAsignatura = ? AND AsignaturaSeccion.idSeccion = ? 
  `;
  const values = [codigo, seccion];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error("Error al obtener los detalles de la asignatura:", err);
      res.status(500).send("Error interno del servidor");
      return;
    }

    if (result && result.length > 0) {
      // Si se encontraron detalles de la asignatura, devolverlos como respuesta
      res.status(200).json(result[0]);
    } else {
      // Si no se encontraron detalles de la asignatura, devolver un mensaje de error
      console.error("No se encontraron detalles de la asignatura.");
      res.status(404).send("No se encontraron detalles de la asignatura");
    }
  });
});

// Ruta para guardar la planificación y los minutos en la tabla CargaDocente
app.post("/guardar-carga-docente", (req, res) => {
  const {
    idProfesor,
    idAsignaturaSeccion,
    HorasPlanificacion,
    Horas_Minutos,
    Anio,
  } = req.body;

  db.query(
    "INSERT INTO CargaDocente (idProfesor, idAsignaturaSeccion, HorasPlanificacion, Horas_Minutos, Anio) VALUES (?, ?, ?, ?, ?)",
    [idProfesor, idAsignaturaSeccion, HorasPlanificacion, Horas_Minutos, Anio],
    (err, result) => {
      if (err) {
        console.error("Error al guardar la carga docente:", err);
        res.status(500).send("Error interno del servidor");
        return;
      }
      res.status(200).json({ message: "Carga docente guardada exitosamente" });
    }
  );
});


/* Listar todas las Cargas Academicas */
app.get("/VisualizarCA", (req, res) => {
  db.query("SELECT * FROM cargaacademica.Asignatura", (err, results) => {
    if (err) {
      res.status(500).send("Error fetching posts");
      return;
    }
    res.json(results);
  });
});
/* Visualizar VisualizarCA */
app.get("/VisualizarCA/:id", (req, res) => {
  const cargarAc = req.params.ideCargaDocente;
  db.query(
    "SELECT * FROM cargaacademica.CargaDocente WHERE ideCargaDocente =?",
    [cargarAc],
    (err, result) => {
      if (err) {
        res.status(500).send("Error fetching post");
        return;
      }
      if (result.length === 0) {
        res.status(404).send("Post not found");
        return;
      }
      res.json(result[0]);
    }
  );
});

/* Start server */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
