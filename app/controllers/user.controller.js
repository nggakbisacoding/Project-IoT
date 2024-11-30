const user = require('../function/user');
const asyncHandler = require('express-async-handler')

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
        user.findsAll(req, res);
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