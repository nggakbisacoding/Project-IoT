const express = require('express');
const cors = require('cors');
const db = require('./app/config/database');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const corsOptions = require('./app/config/corsOptions')
const cookieParser = require('cookie-parser');
const errorHandler = require('./app/middleware/errorHandler');
const { logger } = require('./app/middleware/logger');
const { logEvents } = require('./app/middleware/logger')

const app = express();

app.use(logger);
// app.use(cors(corsOptions));
// app.use(cookieParser);
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(db.url).then(()=>console.log("database connected"));
    
require('./app/routes/sensor.router')(app);
require('./app/routes/notif.router')(app);
require('./app/routes/device.router')(app);
require('./app/routes/user.router')(app);
require('./app/routes/chart.router')(app);

app.use(errorHandler);

const PORT = process.env.port || 8000

mongoose.connection.once('open', err => {
    app.listen(PORT, ()=>{
        console.log(`app listening at http://localhost:${PORT}`);
    })
})

mongoose.connection.on('error', err => {
    console.log(err);
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostnme}`, 'monggoError.log')
})