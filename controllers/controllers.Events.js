import fs from 'fs/promises';

import Photo from '../models/Photo.js';
import Events from '../models/Events.js';
import Users from '../models/Users.js';
import RegisterEvent from '../models/RegisterEvent.js';

import { sendMail } from '../services/Mail.js';

export default {
  createEvents: async (req, res) => {
    try {
      const { title, description, dateTime, location } = req.body;
      const { id } = req.user;

      const { files = null } = req;

      const user = await Users.findByPk(id);
      if (!user) {
        if (files) {
          files.forEach(file => fs.unlink(file.path));
        }

        return res.status(404).json({ message: 'User not found' });
      }

      const event = await Events.create({
        title,
        description,
        dateTime,
        location,
        userId: id,
      });

      if (files && files.length > 0) {
        for (let photo of files) {
          await Photo.create({
            path: Photo.processFilePath(photo),
            eventId: event.id,
          });
        }
      }

      const result = await Events.findByPk(event.id, {
        include: [
          {
            model: Photo,
            attributes: ['path'],
          },
        ],
      });

      res.status(201).json({
        message: 'Event created successfully',
        result,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message, status: 500 });
    }
  },

  SendEvents: async (req, res) => {
    try {
      const { id } = req.params;
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({ message: 'You must provide an email' });
      }

      const event = await Events.findByPk(id);

      if (!event) {
        return res
          .status(403)
          .json({ message: 'You are not allowed to register for this event' });
      }

      await sendMail({
        to: email,
        subject: 'Event Registration',
        template: 'sendEvent',
        templateData: {
          title: event.title,
          description: event.description,
          dateTime: new Date(event.dateTime).toLocaleString(),
          location: event.location,
          link: `http://localhost:3000/event/send?id=${event.id}`,
        },
      });

      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  registerEvent: async (req, res) => {
    try {
      const { firstName, lastName, email } = req.body;
      const { id } = req.query;
      console.log(req.body);

      const event = await Events.findByPk(id);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }

      const registerEvent = await RegisterEvent.create({
        firstName,
        lastName,
        email,
        registerId: event.id,
      });

      res
        .status(201)
        .json({ message: 'Event registered successfully', registerEvent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  getEvents: async (req, res) => {
    try {
      const { id } = req.user;
      const { limit = 10, page = 1 } = req.query;
      const offset = Math.floor((page - 1) * limit);

      const events = await Users.findAll({
        attributes: ['id', 'firstName', 'lastName', 'email'],
        include: [
          {
            model: Events,
          },
        ],
        where: {
          id,
        },
        limit,
        offset,
      });

      res.status(200).json({ message: 'events list', events });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message, status: 500 });
    }
  },
  updateEvent: async (req, res) => {
    try {
      const { id } = req.params;
      const { id: userId } = req.user;
      const { title, description, dateTime, location } = req.body;
      const { files = null } = req;

      const event = await Events.findOne({
        where: { id, userId },
        include: {
          model: Photo,
        },
      });

      if (!event) {
        if (files) {
          files.forEach(async file => await fs.unlink(file.path));
        }
        return res
          .status(403)
          .json({ message: 'You are not allowed to edit this event' });
      }

      await Events.update(
        { title, description, dateTime, location },
        { where: { id } }
      );

      const pathPhotos = await Photo.findAll({ where: { eventId: event.id } });
      await Photo.deleteFiles(pathPhotos);
      await Photo.destroy({ where: { eventId: event.id } });
      if (files) {
        for (let photo of files) {
          await Photo.create({
            path: Photo.processFilePath(photo),
            eventId: event.id,
          });
        }
      }

      const registeredUsers = await RegisterEvent.findAll({
        where: { registerId: event.id },
        attributes: ['email'],
      });

      registeredUsers.forEach(async user => {
        sendMail({
          to: await user.email,
          subject: 'Event Update',
          template: 'eventUpdated',
          templateData: {
            title: event.title,
            description: event.description,
            dateTime: new Date(event.dateTime).toLocaleString(),
            location: event.location,
          },
        });
      });
      res.status(200).json({ message: 'Event updated successfully', event });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message, status: 500 });
    }
  },

  updatePhoto: async (req, res) => {
    try {
      const { id } = req.params;
      const { file = null } = req;

      const photo = await Photo.findByPk(id, {
        raw: true,
      });
      if (!photo) {
        if (file) {
          await fs.unlink(file.path);
        }
        res.status(403).json({ message: 'Photo not found' });
        return;
      }

      await Photo.deleteFiles([photo.path]);

      await Photo.update(
        { path: Photo.processFilePath(file) },
        { where: { id: photo.id } }
      );
      res.status(200).json({ message: 'Photo updated successfully' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message, status: 500 });
    }
  },
};
