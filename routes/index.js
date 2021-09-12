var express = require('express');
var router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const TOKEN_SECRET = 'SECRET';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

router.get('/app', function(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      console.log('error is', err);
      // res.status(500).send('An error has occurred, we cannot greet you at the moment.');
      res.render('app', { user: 'error'});
    }
    else {
      console.log('user is', user);
      console.log('info is', info);
      // const todos =
      res.render('app', { user: user.email, todos: [{ text: "hi"}] });
      // res.send({ success: true, fullName: `${user.name.givenName} ${user.name.familyName}` })
    }
  })(req, res, next);
  // res.render('app', { user: ''});
});


router.post('/auth/login', function(req, res, next) {
  console.log('passportCB - req, res, other', req, res);
  const email = req.body.username;
  console.log('email', email);
  const token = jwt.sign({ email }, TOKEN_SECRET, {
    expiresIn: 60 * 60,
  });
  console.log('token', token);
  res.cookie('auth', token, { httpOnly: true });
  res.json({ success: true });
  // res.redirect('/app');
});


module.exports = router;
