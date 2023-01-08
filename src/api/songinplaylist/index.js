const SongInPlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'songinplaylist',
  version: '1.0.0',
  register: async (server, {
    songInPlaylistService,
    playlistService,
    songService,
    activitiesService,
    validator,
  }) => {
    const songInPlaylistHandler = new SongInPlaylistHandler(
      songInPlaylistService,
      playlistService,
      songService,
      activitiesService,
      validator,
    );
    server.route(routes(songInPlaylistHandler));
  },
};
