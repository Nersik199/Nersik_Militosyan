import Joi from 'joi';

export default {
  createEvents: Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(3).max(50).required(),
    dateTime: Joi.string().min(3).max(50).required(),
    location: Joi.string().min(3).max(50).required(),
  }),

  registerEvent: Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(3).max(50).required(),
    email: Joi.string().email().required(),
  }),

  updateEvent: Joi.object({
    title: Joi.string().min(3).max(50).required(),
    description: Joi.string().min(3).max(50).required(),
    dateTime: Joi.string().min(3).max(50).required(),
    location: Joi.string().min(3).max(50).required(),
  }),
};
