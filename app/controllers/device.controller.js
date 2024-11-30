const mongoose = require('mongoose')
const db = require('../models/device.model')
const chart = require('../models/chart.model')
const asyncHandler = require('express-async-handler');

exports.create =  asyncHandler(async (req,res)=>{
    const { name, active } = req.body;
    try {
        const existingDevice = await db.findOne({ name });
        if (existingDevice) {
            return res.status(400).json({
                error: 'Device already exists'
            });
        }
        const newDevice = new db({ name, active });
        await newDevice.save();

        const newChart = new chart({ device: newDevice._id, name: newDevice.name});
        await newChart.save();

        res.json({ message: 'Device created' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

exports.findAll = asyncHandler(async (req, res, next)=>{
    try {
        const allDevice = await db.find().lean().exec();
        res.json({ allDevice });
    } catch (error) {
        next(error);
    }
});

exports.show = asyncHandler(async (req,res,next)=>{
    let id = req.params.id

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: 'Invalid id',
        });
    }
    
    try {
        const oneDevice = await db.findById(id).exec();
        res.json({ oneDevice });
    } catch (error) {
        next(error);
    }
});

exports.update = asyncHandler(async (req,res)=>{
    const id = req.params.id

    try {
        const { id, name, active } = req.body;
        
        const device = await db.findById(id).exec();
        
        if(!device) {
            return res.status(500).json({ message: 'Device not found'});
        }

        const duplicate = await db.findOne({ name }).lean().exec()


        if(duplicate && duplicate?._id.toString() !== id) {
            return res.status(409).json({ message: 'Duplicated email'})
        }

        device.name = name
        device.active = active

        const updatedDevice = await db.save();

        res.json({ message: `${updatedDevice.name} updated`})
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

exports.delete = asyncHandler(async (req,res)=>{
    const { id } = req.body
    try {
        if (!id) {
            return res.status(400).json({ message: 'DeviceID required' })
        }

        const charts = await chart.findOne({ user: id }).lean().exec();

        if (charts?.length) {
            await charts.deleteOne();
        }

        const device = await db.findById(id).exec();

        if (!device) {
            return res.status(400).json({ message: 'Device not found' });
        }

        const result = await device.deleteOne();

        const reply = `Device ${result} deleted`;

        res.json(reply);
    } catch (error) {
        next(error);
    }
});