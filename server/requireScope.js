import {verify} from './jwt'

export default (roles)=>(req, res, next)=>{
    if (!req.headers.authorization) return res.sendStatus(401);
    if (req.headers.authorization.split(' ').length < 2) return res.sendStatus(400);
    const token = req.headers.authorization.split(' ')[1];
    try {
        const data = verify(token, 'my-secret');
        if (!roles || roles.includes(data.scope)){
            req.user = data;
            next();
        }else{
            res.sendStatus(403);
        }
    } catch (e) {
        res.status(401).json({
            error: e.message
        })
    }
}