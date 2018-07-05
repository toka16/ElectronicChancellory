import {
    Router
} from 'express'

import requireScope from '../requireScope'

import {
    getNotifications,
    setNotificationSeen
} from '../db'

const router = Router()

router.get('/', requireScope(), (req, res) => {
    getNotifications(req.user.id).then((notifications) => {
        res.json(notifications);
    }).catch((err) => {
        res.status(500).send(err);
    })
})

router.put('/:id/seen', requireScope(), (req, res)=>{
    setNotificationSeen(req.params.id, req.user.id).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        res.status(500).send(err);
    })
})

export default router;