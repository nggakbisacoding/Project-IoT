const user = require('../controllers/user.controller')
const route = require('express').Router()
const { authenticateUser } = require('../middleware/authentication');
const validateUser = require('../middleware/authentication')

module.exports = app =>{    

    route.post('/register', user.register);
    route.post('/login', user.login);
    route.route('/')
    .get(user.findsAll)
    .patch(user.update)
    .delete(user.delete);
    route.get('/:id', user.show);
    route.get('/protected', authenticateUser, user.protected);

    app.use('/user',  route);
}