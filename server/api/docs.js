import {
    Router
} from 'express'

import requireScope from '../requireScope'

import {
    saveDoc,
    getDoc,
    signDoc,
    getAllDocs,
    getUserDocs,
    getUserSignedDocs,
    getUnsignedDocs,
    changeAssigneeOfDoc,
    getComments,
    saveComment
} from '../db'

const router = Router()

router.get('/', requireScope(["operator", "user"]), (req, res) => {
    let group = req.query.group || "signed-by-me"
    let docGetter
    switch (req.user.scope) {
        case "operator":
            switch (group) {
                case "all":
                    docGetter = () => getAllDocs()
                    break
                case "signed-by-me":
                    docGetter = () => getUserSignedDocs(req.user.id)
                    break
                case "unsigned":
                    docGetter = () => getUnsignedDocs()
                    break
            }
            break
        case "user":
            docGetter = () => getUserDocs(req.user.id)
    }
    docGetter().then(docs => {
        res.json(docs);
    }).catch(err => {
        res.status(500).send(err);
    })
})

router.get('/:id', requireScope(["operator", "user"]), (req, res) => {
    getDoc(req.params.id).then(doc => {
        res.json(doc);
    }).catch(err => {
        res.status(500).send(err);
    })
})

router.put("/:id/assignee", requireScope(["operator", "user"]), (req, res)=>{
    changeAssigneeOfDoc(req.params.id, req.body.id).then(()=>{
        res.sendStatus(200);
    }).catch(err=>{
        res.status(500).send(err);
    })
})

router.post('/', requireScope(['user']), (req, res) => {
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
    }).catch((err) => {
        res.status(500).send(err);
    })
})

router.post('/:id/sign', requireScope(['operator']), (req, res) => {
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


router.get("/:id/comments", requireScope(['operator', 'user']), (req, res) => {
    getComments(req.params.id).then(comments => {
        res.json(comments);
    }).catch((err) => {
        res.status(500).send(err);
    })
});


router.post('/:id/comments', requireScope(['operator', 'user']), (req, res) => {
    const comment = {
        author_id: req.user.id,
        document_id: req.params.id,
        text: req.body.text,
        created_at: new Date()
    }

    saveComment(comment).then(() => {
        res.sendStatus(200);
    }).catch((err) => {
        res.status(500).send(err);
    })
})

export default router;