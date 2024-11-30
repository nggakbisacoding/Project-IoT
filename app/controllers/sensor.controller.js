const asyncHandler = require('express-async-handler');
const db = require('../models/sensor.model');
const upload = require('../function/upload');
const threshold = require('../models/threshold.model');
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

        const newThreshold = new threshold({ sensor: newSensor._id });
        await newThreshold.save();

        const newValue = new value({ sensor: newSensor._id, value: 0 });
        await newValue.save();

        res.json({ message: 'Sensor created' });
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
        const allFeatures = await features.find({ active: true }).lean().exec();
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

exports.addData = asyncHandler(async (req, res, next) => {
    const { id } = req.params
    try {
        const value = await value.findOne({ sensor: id }).exec();
        sensor.value.push(req.body.value);
        sensor.save();
        res.json({ message: "Data added " });
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