const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require('cors');


const app = express();
const corsOptions = ({
    origin: ['https://blog-app-sepia-nine.vercel.app/', 'http://localhost:8000', 'http://localhost:3000'],
    credentials: true,
    optionsSuccessStatus: 200
})

app.use(cors(corsOptions));

mongoose.connect(process.env.MONGODB_STRING);
mongoose.connection.once('open', () => console.log('Now connected to Database'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

app.use('/users', userRoutes);
app.use('/posts', postRoutes);



if(require.main === module) {
	app.listen(process.env.PORT, () => console.log(`API is now online on port ${process.env.PORT}`));
};
module.exports = {app, mongoose};