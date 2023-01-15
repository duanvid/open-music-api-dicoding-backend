const UploadHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'upload',
  version: '1.0.0',
  register: async (server, { service, coverService, validator }) => {
    const uploadHandler = new UploadHandler(service, coverService, validator);

    server.route(routes(uploadHandler));
  },
};
