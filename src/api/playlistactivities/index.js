const PlaylistActivitiesHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlistservice',
  version: '1.0.0',
  register: async (server, { playlistActivitiesService, playlistService }) => {
    const playlistActivitiesServiceHandler = new PlaylistActivitiesHandler(
      playlistActivitiesService,
      playlistService,
    );
    server.route(routes(playlistActivitiesServiceHandler));
  },
};
