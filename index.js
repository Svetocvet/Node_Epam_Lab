const express = require('express');
const mongoose = require('mongoose');
const app = express();
const config = require('./config/default');

const userRouter = require('./routers/userRouter');
const authRouter = require('./routers/authRouter');
const truckRouter = require('./routers/truckRouter');
const loadRouter = require('./routers/loadRouter');

mongoose.connect(config.db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

app.use(express.json());

app.use('/api', userRouter);
app.use('/api', authRouter);
app.use('/api', truckRouter);
app.use('/api', loadRouter);
app.use('*', (req, res) =>
    res.status(400).json({message: 'Router not found'}),
);

app.listen(config.port, () => {
    console.log(`Server listens on ${config.port} port`);
});

module.exports.app = app;
