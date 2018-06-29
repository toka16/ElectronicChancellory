import { Router } from 'express'

import requireScope from '../requireScope'
import {
  getUsers,
  saveUser,
} from '../db'

const router = Router()

router.get('/users', function (req, res) {
  getUsers().then((users)=>{
    res.json(users);
  }).catch(err=>{
    res.status(500).send(err);
  })
})

router.post('/register', requireScope(['admin']), (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    scope
  } = req.body;
  const user = {
    first_name,
    last_name,
    email,
    password,
    scope
  };
  saveUser(user).then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    if (err.errno === 1062) { // duplicate entry
      return res.status(400).json({
        error: "This email is already registered"
      })
    }
    res.status(500).send(err);
  })
})

export default router
