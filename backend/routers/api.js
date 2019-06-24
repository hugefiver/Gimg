const express = require('express');
const router = express.Router();

const loginRouter = require('./apis/login');
const checkRouter = require('./apis/check');
const logoutRouter = require('./apis/logout');
const uploadRouter = require('./apis/upload');
const adminRouter = require('./apis/admin');


// Login
router.use('/login', loginRouter);

// Check
router.use('/check', checkRouter);

// Logout
router.use('/logout', logoutRouter);

// Upload
router.use('/upload', uploadRouter);

// Admin
router.use('/admin', adminRouter);

module.exports = router;
