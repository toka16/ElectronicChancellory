import {
    Router
} from 'express'

import requireScope from '../requireScope'
import {
    login,
    saveUser,
} from '../db'
import {
    sign,
    verify
} from '../jwt'

const router = Router()

router.post('/login', function (req, res, next) {
    login(req.body).then(({
        password,
        ...user
    }) => {
        if (password !== req.body.password) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }
        res.json({
            token: sign(user, "my-secret")
        })
    }).catch((err) => {
        res.status(401).json({
            error: err.message
        });
    })
})
router.post('/logout', (req, res) => {
    res.sendStatus(200)
});

router.get('/user', requireScope(), (req, res, next) => {
    if (req.user) {
        res.json({
            user: req.user
        })
    } else {
        req.sendStatus(500);
    }
})


export default router;