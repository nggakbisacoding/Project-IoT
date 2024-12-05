const sensor = require('../models/sensor.model');
const value = require('../models/value.model');

exports.sensor = async (request) => {
  try {
    const uri = request;

    const response = await fetch(uri, {
      method: 'GET',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' }
    })

    const data = await response.json();

    console.log(data);

    res.json(data);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('server error');
  }
};