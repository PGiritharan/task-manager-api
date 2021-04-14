const express = require('express');
require('./db/mongoose');
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();

// Help to parse the in coming json from request automatically
app.use(express.json());

app.use(userRouter);
app.use(taskRouter);

module.exports = app;