const notif = require('../controllers/notif.controller')
const route = require('express').Router()

module.exports = app =>{

    route.post('/', notif.createNotif)
    route.get('/:id', notif.show)
    route.post('/:id', notif.delete)

    app.use('/notif', route)
}