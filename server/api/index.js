import {
    Router
} from 'express'

import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'

import users from './users'
import auth from './auth'
import docs from './docs'
import keys from './keys'
import notifications from './notifications'

const router = Router()

router.use(bodyParser.json())
router.use(bodyParser.urlencoded({
    extended: true
}))
router.use(cookieParser());

router.use('/auth', auth)
router.use('/docs', docs)
router.use('/keys', keys);
router.use('/notifications', notifications)
router.use('/users', users)

export default router