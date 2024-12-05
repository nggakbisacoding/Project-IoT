const sensor = require('../controllers/sensor.controller')
const route = require('express').Router()

module.exports = app =>{

    route.get('/:id', sensor.findActive)
    route.route('/')
    .post(sensor.create)
    .patch(sensor.update)
    .delete(sensor.delete);
    route.put('/:id', sensor.addData)
    route.get('/all', sensor.findAll)
    route.post('/upload', sensor.upload)
    route.post('/addValue/:id', sensor.addValue)
    route.post('/addData/:id', sensor.addData)
    route.post('/changeActive', sensor.display)
    route.post('/addThreshold', sensor.addThreshold)
    route.post('/updateFormula/:id', sensor.updateFormula)

    app.use('/sensor', route)
}
