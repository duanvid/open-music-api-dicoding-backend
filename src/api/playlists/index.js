const PlaylistHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'Playlist',
  version: '1.0.0',
  register: async (server, {
    service,
    songService,
    songInPlaylistService,
    validator,
  }) => {
    const playlistHandler = new PlaylistHandler(
      service,
      songService,
      songInPlaylistService,
      validator,
    );
    server.route(routes(playlistHandler));
  },
};
