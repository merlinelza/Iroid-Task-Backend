var express = require('express');
const session = require('express-session');
var router = express.Router();

const user = require('../models/user');

router.post('/signup', (req, res) => {
    if (!req.body.name || !req.body.email || !req.body.password) {
        res.status(400).json({ message: 'Fields are mandatory' });
    } else {
        user.findOne({ email: req.body.email }, (err, existingUser) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: 'Internal Server Error' });
            } else if (existingUser) {
                res.status(409).json({ message: 'User already exists' });
            } else {
                var newUser = new user({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                });

                newUser.save((err) => {
                    if (err) {
                        console.log(err);
                        res.status(500).json({
                            message: 'Internal Server Error',
                        });
                    } else {
                        res.status(200).json({
                            message: 'User created successfully',
                            name: newUser.name,
                        });
                    }
                });
            }
        });
    }
});
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    user.findOne({ email, password }, 'name', (err, user) => {
        if (err) {
            console.log('Error:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        if (user) {
            const { name } = user;
            res.status(200).json({ name, message: 'Logged in' });
        } else {
            res.status(401).json({
                message: 'Invalid email or password',
            });
        }
    });
});
router.post('/getUser', async (req, res) => {
    const { email, password } = req.body;

    try {
        const foundUser = await user.findOne({ email, password }, 'name');

        if (foundUser) {
            const userName = foundUser.name;
            res.status(200).json({ name: userName });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
router.get('/:id', (req, res) => {
    const userId = req.params.id;

    user.findById(userId, 'name', (err, user) => {
        if (err) {
            console.log('Error:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        if (user) {
            const userName = user.name;
            res.status(200).json({ name: userName });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    });
});
router.use(
    session({
        secret: 'byebye',
        resave: false,
        saveUninitialized: true,
    })
);
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error:', err);
            res.status(500).json({ message: 'Internal Server Error' });
            return;
        }

        res.status(200).json({ message: 'Logged out successfully' });
    });
});
module.exports = router;
