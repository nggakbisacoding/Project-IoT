const chart = require('../controllers/chart.controller')
const route = require('express').Router()
const { authenticateUser } = require('../middleware/authentication')

module.exports = app =>{

    route.get('/:id', chart.show)
    route.put('/:id', chart.update)

    app.use('/chart', route)
}
