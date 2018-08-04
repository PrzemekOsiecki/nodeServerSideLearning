import express from 'express';
import clientController from './client.controller';

export const clientRouter = express.ROuter();

clientRouter.route('/')
    .post(clientController.create)