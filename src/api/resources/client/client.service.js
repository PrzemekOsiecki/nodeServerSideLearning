import Joi from 'joi';

export default {
    validateCreateSchema(body) {
        const schema = Joi.object().keys({
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            email: Joi.string().email().required()
        });

        const { error, value } = Joi.validate(body, schema)
        if(error && error.details) {
            return { error };
        }
        return { value };
    },

    validateUpdateSchema(body) {
        const schema = Joi.object().keys({
            firstname: Joi.string().optional(),
            lastname: Joi.string().optional(),
            email: Joi.string().email().optional()
        });

        const { error, value } = Joi.validate(body, schema)
        if(error && error.details) {
            return { error };
        }
        return { value };
    }
}