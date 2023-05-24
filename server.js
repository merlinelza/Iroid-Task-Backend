const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3030;
const user = require('./models/user');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());

app.use(cors());

var userModule = require('./modules/userController');

app.use('/user', userModule);

mongoose
    .connect('mongodb://127.0.0.1/iroid', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
