import { Router } from 'express'

import requireScope from '../requireScope'
import {
  getUsers,
  getByRole,
  getUser,
  saveUser,
  updateUser
} from '../db'

const router = Router()

router.get('/', requireScope(["admin"]), function (req, res) {
  getUsers().then((users)=>{
    res.json(users);
  }).catch(err=>{
    res.status(500).send(err);
  })
})

router.get('/operators', requireScope(["operator"]), (req, res)=>{
  getByRole('operator').then(operators=>{
    res.json(operators)
  }).catch((err)=>{
    res.status(500).send(err);
  })
})

router.get('/:id', requireScope(["admin"]), function (req, res) {
  getUser(req.params.id).then((users) => {
    res.json(users);
  }).catch(err => {
    res.status(500).send(err);
  })
})

router.put('/:id', requireScope(["admin"]), function (req, res) {
  req.body.user.id = req.params.id
  updateUser(req.body.user).then(() => {
    res.sendStatus(200);
  }).catch(err => {
    res.status(500).send(err);
  })
})

router.post('/', requireScope(['admin']), (req, res) => {
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
