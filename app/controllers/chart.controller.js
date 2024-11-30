const db = require('../models/chart.model')
const asyncHandler = require('express-async-handler')

exports.show = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    try {

        const chart = await db.findById(id).exec();

        if (!chart) {
            return res.status(400).json({ message: 'Chart not found' });
        }
        res.json(chart);
    } catch (error) {
        next(error);
    }
});

exports.update = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const { name } = req.body;

    try {

        const chart = await db.findById(id).exec();

        if (!chart) {
            return res.status(400).json({ message: 'Chart not found' });
        }

        chart.name = name;

        const result = await chart.save();

        res.json(result);
    } catch (error) {
        next(error);
    }
});