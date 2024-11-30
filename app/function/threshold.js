const threshold = require('../models/threshold');
const sensor = require('../models/sensor.model');
const math = require('mathjs');

exports.show = (req, res) => {
    const { id } = req.body;
    
    const thresholds = threshold.find({ sensor: id });
    const sensors = sensor.findById(id);

    if (req < thresholds.value.split(",")[0] || req > thresholds.value.split(",")[1]) {
        return res.status(400).json({ message: 'Warning! The fire sensor has exceeded the threshold' });
    }

    return (math.evaluate(`${thresholds.formula}`))
}