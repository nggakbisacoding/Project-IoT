require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/user.model');
const device = require('../models/device.model');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await db.findOne({ $or: [{ name }, { email }] });
        if (existingUser) {
            return res.status(400).json({
                error: 'User already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new db({ name, email, password: hashedPassword, role: 'user' });
        await newUser.save();

        res.json({ message: 'User created' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}

exports.findsId = async (req, res) => {
    const { id } = req.params;

    const user = await db.findById(id).exec();

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }
    res.json(user);
}

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db.findOne({ email });
        if (!user) {
            return res.status(401).json({
                error: 'Invalid credentials'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "1h",
            }
        );
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Server error'
        });
    }
}

exports.update = async (req, res) => {
    const { id, name, email, password } = req.body;

    const user = await db.findById(id).exec();

    if(!user) {
        return res.status(500).json({ message: 'User not found'});
    }

    const duplicate = await db.findOne({ email }).lean().exec()

    if(duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicated email'})
    }

    user.name = name
    user.email = email

    if(password) {
        user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({ message: `${updatedUser.name} updated`})
}

exports.delete = async (req, res) => {
    const { id } = req.body

    if(!id) {
        return res.status(400).json({message: 'UserID required'})
    }

    const devices = await device.findOne({ user: id }).lean().exec();

    if (devices?.length) {
        return res.status(400).json({ message: 'User has device'})
    }

    const user = await db.findById(id).exec();

    if(!user) {
        return res.status(400).json({message: 'User not found'});
    }

    const result = await user.deleteOne();

    const reply = `Username ${result.email} with ID ${result._id} deleted`;

    res.json(reply);
}