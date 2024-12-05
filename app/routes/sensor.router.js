const sensor = require('../controllers/sensor.controller')
const route = require('express').Router()

module.exports = app =>{

    route.get('/:id', sensor.show)
    route.route('/')
    .get(sensor.findActive)
    .post(sensor.create)
    .patch(sensor.update)
    .delete(sensor.delete);
    route.put('/:id', sensor.addData)
    route.get('/all', sensor.findAll)
    route.post('/upload', sensor.upload)
    route.post('addValue', sensor.addValue)
    route.post('/addData', sensor.addData)
    route.post('/changeActive', sensor.display)

    app.use('/sensor', route)
}
