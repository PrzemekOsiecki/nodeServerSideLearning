import Invoice from '../models/invoice.model';
import Joi from 'joi';
import HttpStatus from 'http-status-codes';

export default {
    
    findAll(req, res, next) { 
       const {page, perPage = 10, filter, sortField, sortDir} = req.query; 
       const options = {
            //select: '_id, item',
            page: parseInt(page, 10),
            limit: parseInt(perPage, 10)
       };

       const query = {};
       if(filter) {
           query.item = {
               $regex: filter
           }
       }
       if(sortField && sortDir) {
        options.sort = {
            [sortField]: sortDir,
        }
       }

       Invoice.paginate({}, options)//.find()
       .then(invoices => res.json(invoices))
       .catch(err =>
            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json(err))
            .catch(err => 
                err.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(err));
    },

    findOne(req, res){
        let {id} = req.params;
        Invoice.findById(id)
            .then(invoice => {
                if(!invoice) {
                    return res.status(HttpStatus.NOT_FOUND)
                        .json({
                            err: 'Invoice could not found for given id'
                        });
                }
                return res.json(invoice);
            })
            .catch(err => 
                err.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(err));
    },

    create(req, res) {
        const schema = Joi.object().keys({
            item: Joi.string().required(),
            date: Joi.date().required(),
            due: Joi.date().required(),
            qty: Joi.number().integer().required(),
            tax: Joi.number().optional(),
            rate: Joi.number().optional()
        });
        
        const {error, value} = Joi.validate(req.body, schema);

        if(error && error.details) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(error); //400
        }

        Invoice.create(value)
        .then(invoices => res.json(invoices))
        .catch(err =>
             res.status(HttpStatus.INTERNAL_SERVER_ERROR)
             .json(err));
    },

    update(req, res) {
        let {id} = req.params;

        const schema = Joi.object().keys({
            item: Joi.string().optional(),
            date: Joi.date().optional(),
            due: Joi.date().optional(),
            qty: Joi.number().integer().optional(),
            tax: Joi.number().optional(),
            rate: Joi.number().optional()
        });
        
        const {error, value} = Joi.validate(req.body, schema);

        if(error && error.details) {
            return res
                .status(HttpStatus.BAD_REQUEST)
                .json(error);
        }

        Invoice.findByIdAndUpdate({_id: id}, value, {new: true})
            .then(invoice => res.json(invoice)) //new:true I want to see updated record in response
            .catch(err =>
                err.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json(err));
    },

    delete(req, res) {
        let {id} = req.params;
        Invoice.findByIdAndRemove(id)
            .then(invoice => {
                if(!invoice) {
                    return res.status(HttpStatus.NOT_FOUND)
                        .json({err: 'Invoice could not delete for given id'});
                }
                return res.json(invoice);
            })
            .catch(err => err.status(HttpStatus.INTERNAL_SERVER_ERROR).json(err));
    }

}