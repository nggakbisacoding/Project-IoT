const notif = require('../controllers/notif.controller')
const route = require('express').Router()

module.exports = app =>{

    route.post('/', notif.create)
    route.get('/', notif.findAll)
    route.get('/:id', notif.show)
    route.post('/:id', notif.delete)

    app.use('/notif', route)
}