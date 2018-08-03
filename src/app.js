//const express = require('express');
import express from 'express';


import mongoose from 'mongoose';
import logger from 'morgan';

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../src/config/swagger.json';

import cors from 'cors';
import { restRouter } from './api';

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/invoice-builder');
//                  host            / db name

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({extended:true})); //BodyParser 
app.use(express.urlencoded({extended:true})); //parsing url parameters 

app.use(logger('dev')); //other option is for example: combined

app.use('/api', restRouter);

app.use('/api-docs', swaggerUi.serve, 
swaggerUi.setup(swaggerDocument, {
    explorer: true
}));

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.message = 'Invalid route';
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.json({
        error: {
            message: error.message
        }
    });
});

app.get('/', (req, res) => {
    res.json({
        msg: 'Welcome to GET request handler'
    });
});

const invoices = [
    {_id: 1, name: 'Amazing Product1', qty: 10, date: new Date()},
    {_id: 2, name: 'Some Product2', qty: 10, date: new Date()},
    {_id: 3, name: 'Petarda Product3', qty: 10, date: new Date()}
];

app.get('/invoices', (req, res) => {
    res.json(invoices);
});

app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
});