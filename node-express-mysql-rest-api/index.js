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
  database: 'node_express_mysql'
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
/* List all posts */
app.get('/asignatura', (req, res) => {
  db.query('SELECT * FROM posts', (err, results) => {
    if (err) {
      res.status(500).send('Error fetching posts');
      return;
    }
    res.json(results);
  });
});
   
/* Create a new post */
app.post('/asignatura/crear', (req, res) => {
  const { title, body } = req.body;
  db.query('INSERT INTO posts (title, body) VALUES (?, ?)', [title, body], (err, result) => {
    if (err) {
      res.status(500).send('Error creating post');
      return;
    }
    const postId = result.insertId;
    db.query('SELECT * FROM posts WHERE id = ?', postId, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching created post');
        return;
      }
      res.status(201).json(result[0]);
    });
  });
});
  
/* Get a specific post */
app.get('/asignatura/view/asignaturaId', (req, res) => {
  const postId = req.params.id;
  db.query('SELECT * FROM posts WHERE id = ?', postId, (err, result) => {
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
  
/* Update a post */
app.put('/asignatura/editar/asignaturaId', (req, res) => {
  const postId = req.params.id;
  const { title, body } = req.body;
  db.query('UPDATE posts SET title = ?, body = ? WHERE id = ?', [title, body, postId], err => {
    if (err) {
      res.status(500).send('Error updating post');
      return;
    }
    db.query('SELECT * FROM posts WHERE id = ?', postId, (err, result) => {
      if (err) {
        res.status(500).send('Error fetching updated post');
        return;
      }
      res.json(result[0]);
    });
  });
});
  
/* Delete a post */
app.delete('/posts/:id', (req, res) => {
  const postId = req.params.id;
  db.query('DELETE FROM posts WHERE id = ?', postId, err => {
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