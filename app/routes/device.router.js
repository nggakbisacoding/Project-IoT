const device = require('../controllers/device.controller')
const route = require('express').Router()

module.exports = app =>{

    route.get('/:id', device.show)
    route.post('/', device.create)
    route.put('/:id', device.update)
    route.delete('/:id', device.delete)
    route.get('/', device.findAll)

    app.use('/device', route)
}
