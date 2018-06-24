import {
    Router
} from 'express'

import requireScope from '../requireScope'

import {
    saveKey,
    findKeys
} from '../db'

const router = Router()

router.post('/', requireScope(['operator', 'admin']), (req, res) => {
    const key = {
        pub_key: req.body.key,
        owner_id: req.user.id,
        created_at: new Date()
    }
    saveKey(key).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        res.status(500).send(err);
    })
})

router.get('/', requireScope(), (req, res)=>{
    findKeys(req.query).then(keys=>{
        res.json(keys);
    }).catch(err=>{
        res.status(500).send(err);
    })
})

export default router;