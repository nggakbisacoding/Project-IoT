const asyncHandler = require('express-async-handler');
const db = require('../models/sensor.model');
const sensor = require('../function/sensor');
const upload = require('../function/upload');
const threshold = require('../models/threshold.model');
const formula = require('../models/formula.model');
const thresholdFunction = require('../function/threshold');
const value = require('../models/value.model');

exports.create = asyncHandler(async (req, res) => {
    const { name, api_url } = req.body;
    try {
        const existingDevice = await db.findOne({ name });
        if (existingDevice) {
            return res.status(400).json({
                error: 'Sensor already exists'
            });
        }
        const newSensor = new db({ name, api_url });
        await newSensor.save();

        const newValue = new value({ sensor: newSensor._id });
        await newValue.save();

        const newFormula = new formula({ sensor: newSensor._id });
        await newFormula.save();
        
        sensor(api_url);
    } catch (error) {
        res.status(500).json({ error });
    }
});

exports.showFeatures = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const features = await value.findById(id).exec();

        if (!features) {
            return res.status(400).json({ message: 'Sensor not found' });
        }
        res.json(features);
    } catch (error) {
        next(error);
    }
});

exports.upload = (req, res) => {
    upload.single('file')(req, res, (err) => {
        if (err) {
            res.status(500).send({ message: err.message })
        }
        res.send({ message: "File uploaded successfully" })
    });
}

exports.findAll = asyncHandler(async (req, res, next) => {
    try {
        const allSensor = await db.find().lean().exec();
        res.json({ allSensor });
    } catch (error) {
        next(error);
    }
});

exports.findActive = asyncHandler(async (req, res, next) => {
    try {
        thresholdFunction.show(req);
        const allFeatures = await value.find({ active: true }).lean().exec();
        res.json({ allFeatures });
    } catch (error) {
        next(error);
    }
});

exports.show = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {

        const sensor = await db.findById(id).exec();

        if (!sensor) {
            return res.status(400).json({ message: 'Sensor not found' });
        }
        res.json(sensor);
    } catch (error) {
        next(error);
    }
});

exports.addValue = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { functionName, values, date } = req.body;
    try {
        const db = await value.findOne({ sensor: id }).exec();
        db.functionName = functionName;
        db.values.push(values);
        db.date.push(date);
        db.save();
        res.json({ message: "Data added " });
    } catch (error) {
        next(error);
    }
});

exports.addData = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {
        const db = await value.findOne({ sensor: id }).exec();
        db.value.push(req.body.value);
        db.save();
        res.json({ message: "Data added " });
    } catch (error) {
        next(error);
    }
});

exports.display = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { jsonData } = req.body;
    try {
        for(const key in jsonData) {
            jsonData[key].forEach(async item => {
                const db = await value.findOne({ functionName: item.name }).exec();
                db.active = item.active;
                db.save();
            });
        }
        res.json({ message: "Features edited" });
    } catch (error) {
        next(error);
    }
});

exports.update = asyncHandler(async (req, res, next) => {
    const { id, name, parameter, isDisplay } = req.body;
    try {

        const sensor = await db.findById(id).exec();

        if (!sensor) {
            return res.status(500).json({ message: 'Sensor not found' });
        }

        const duplicate = await db.findOne({ name }).lean().exec()

        if (duplicate && duplicate?._id.toString() !== id) {
            return res.status(409).json({ message: 'Duplicated sensor' })
        }

        sensor.name = name
        sensor.parameter = parameter
        sensor.isDisplay = isDisplay

        const updatedSensor = await sensor.save();

        res.json({ message: `${updatedSensor.name} updated` })

        res.json(result);
    } catch (error) {
        next(error);
    }
});

exports.delete = asyncHandler(async (req, res, next) => {
    const { id } = req.body
    try {

        if (!id) {
            return res.status(400).json({ message: 'SensorID required' })
        }

        const thresholds = await threshold.findOne({ user: id }).lean().exec();

        if (thresholds?.length) {
            await thresholds.deleteOne();
        }

        const sensors = await db.findById(id).exec();

        if (!sensors) {
            return res.status(400).json({ message: 'Sensor not found' });
        }

        const result = await sensors.deleteOne();

        const reply = `Device ${result} deleted`;

        res.json(reply);
    } catch (error) {
        next(error);
    }
});