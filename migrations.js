import Users from './models/Users.js';
import Events from './models/Events.js';
import Photo from './models/Photo.js';
import RegisterEvent from './models/RegisterEvent.js';

const models = [Users, Photo, Events, RegisterEvent];

(async () => {
  for (const model of models) {
    await model.sync({ alter: true });
    console.log(model.name, `created table ;`);
  }
})();
