const user = require('../function/user');
const asyncHandler = require('express-async-handler');
const db = require('../models/user.model');

// Register db.user
exports.register = asyncHandler(async (req, res, next) => {
    try {
        user.register(req, res);
    } catch (error) {
        next(error);
    }
})

// Login db.user
exports.login = asyncHandler(async (req, res, next) => {
    try {
        user.login(req, res);
    } catch (error) {
        next(error);
    }
});

exports.update = asyncHandler(async (req, res, next) => {
    try {
        user.update(req, res);
    } catch (error) {
        next(error);
    }
});

exports.delete = asyncHandler(async (req, res, next) => {
    try {
        user.delete(req, res);
    } catch (error) {
        next(error);
    }
});

exports.findsAll = asyncHandler(async (req, res, next) => {
    try {
        const user = await db.find().lean().exec();
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
});

exports.show = asyncHandler(async (req, res, next) => {
    try {
        user.findsId(req, res);
    } catch (error) {
        next(error);
    }
});

exports.protected = (req, res) => {
    res.json({ message: 'Protected route accessed' });
}