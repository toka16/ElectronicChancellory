import {
    Router
} from 'express'

import requireScope from '../requireScope'

import {
    saveDoc,
    getDoc,
    signDoc,
    getAllDocs
} from '../db'

const router = Router()

router.get('/', (req, res)=>{
    getAllDocs().then(docs=>{
        res.json(docs);
    }).catch(err=>{
        res.status(500).send(err);
    })
})

router.get('/:id', (req, res)=>{
    getDoc(req.params.id).then(doc=>{
        res.json(doc);
    }).catch(err=>{
        res.status(500).send(err);
    })
})

router.post('/', requireScope(['operator', 'admin']), (req, res) => {
    const doc = {
        title: req.body.title,
        text: req.body.text,
        author_id: req.user.id,
        created_at: new Date()
    }
    saveDoc(doc).then((result) => {
        res.json({
            id: result.insertId
        });
    }).catch((err)=>{
        res.status(500).send(err);
    })
})

router.post('/:id/sign', requireScope(['operator', 'admin']), (req, res)=>{
    const signature = {
        user_id: req.user.id,
        document_id: req.params.id,
        signature: req.body.signature,
        created_at: new Date()
    }
    signDoc(signature).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        res.status(500).send(err);
    });
});

export default router;