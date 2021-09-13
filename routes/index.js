var express = require('express');
var router = express.Router();
const jwt = require('jsonwebtoken');
const TOKEN_SECRET = 'SECRET';

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/auth/login', function(req, res, next) {
  const email = req.body.username;
  const token = jwt.sign({ email }, TOKEN_SECRET, {
    expiresIn: 60 * 60,
  });
  res.cookie('auth', token, { httpOnly: true });
  req.query.redirectToTodos ? res.redirect('/todos') : res.json({ success: true });
});


module.exports = router;
