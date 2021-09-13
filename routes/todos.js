const express = require('express');
const router = express.Router();
const passport = require('passport');
const mongoose = require('mongoose');

async function connectToMongoose() {
  await mongoose.connect('mongodb://localhost:27017/test');
}

connectToMongoose().catch(err => console.log(err));

const todoSchema = new mongoose.Schema({
  text: String,
  email: String
});

const Todo = mongoose.model('Todo', todoSchema);

router.get('/',
  (req, res, next) => {
    passport.authenticate('jwt', { session: false },  async (err, user, info) => {
      if (err) {
        console.log('error is', err);
        res.status(500).send('An error has occurred, we cannot greet you at the moment.');
      }
      else {
        console.log('user is', user);
        console.log('info is', info);
        const { email } = user;
        const todos = await Todo.find({ email });

        res.render('app',{ success: true, user: email, todos });
      }
    })(req, res, next);
  });


router.post('/',
  (req, res, next) => {
    passport.authenticate('jwt', { session: false },  async (err, user, info) => {
      if (err) {
        console.log('error is', err);
        res.status(500).send('An error has occurred, we cannot greet you at the moment.');
      }
      else {
        console.log('user is', user);
        console.log('info is', info);
        const todo = new Todo({ text: 'Hey that is my new todo', email: user.email });
        await todo.save();
        res.json({ success: true });
      }
    })(req, res, next);
  });


module.exports = router;
