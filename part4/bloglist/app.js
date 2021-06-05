const config = require('./utils/config');
const express = require('express');
const app = express();
const cors = require('cors');
const blogRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');
const logger = require('./utils/logger');
const mongoose = require('mongoose');
const morgan = require('morgan');

logger.info('connecting to', config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch(err => {
    logger.error('error connecting to MongoDB:', err.message);
  });

app.use(cors());
app.use(express.json());
app.use('/api/blogs', blogRouter);
morgan.token('body', req => JSON.stringify(req.body));
app.use(morgan(':method :url :response-time ms \n :body'));
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
