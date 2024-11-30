const db = require('../models/notif.model');
const asyncHandler = require('express-async-handler');

exports.create = asyncHandler( async (req,res) => {
    const { name, parameter, isDisplay } = req.body;
    try {
        const existingNotif = await db.findOne({ name });
        if (existingNotif) {
            return res.status(400).json({
                error: 'Notif already exists'
            });
        }
        const newNotif = new db({ name, parameter, isDisplay });
        await newNotif.save();

        res.json({ message: 'Notif created' });
    } catch (error) {
        res.status(500).json({ error });
    }
});

exports.findAll = asyncHandler( async (req, res, next)=>{
    try {
        const allNotif = await db.find().lean().exec();
        res.json({ allNotif });
    } catch (error) {
        next(error);
    }
});

exports.show = asyncHandler( async (req, res)=>{
    const { id } = req.params;
    try {

        const notif = await db.findById(id).exec();

        if (!notif) {
            return res.status(400).json({ message: 'Notif not found' });
        }
        res.json(notif);
    } catch (error) {
        next(error);
    }
});

exports.delete = asyncHandler( async (req, res)=>{
    const id = req.params.id
    db.findOneAndDelete(id)
        .then(data=>{
            if(!data){
                res.status(404).send({message: "Notif Not Found"})
            }
            res.send({message:"Notif deleted"})
        })
        .catch(err=>res.status(500).send({message:err.message}))
});