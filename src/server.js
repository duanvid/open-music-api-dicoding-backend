require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');

const songs = require('./api/song');
const SongService = require('./services/postgres/SongService');
const SongValidator = require('./validator/song');

const albums = require('./api/album');
const AlbumServices = require('./services/postgres/AlbumService');
const AlbumValidator = require('./validator/albums');

const users = require('./api/users');
const UserService = require('./services/postgres/UserService');
const UserValidator = require('./validator/users');

const ClientError = require('./exeptions/ClientError');
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');
const PlaylistService = require('./services/postgres/PlaylistService');
const Playlists = require('./api/playlists');
const PlaylistValidator = require('./validator/playlist');
const SongInPlaylistService = require('./services/postgres/SongInPlaylistService');
const songinplaylist = require('./api/songinplaylist');

const init = async () => {
  const songService = new SongService();
  const albumService = new AlbumServices();
  const userService = new UserService();
  const authenticationsService = new AuthenticationsService();
  const playlistService = new PlaylistService();
  const songInPlaylistService = new SongInPlaylistService();

  const server = Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });

        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Service failed in our server',
      });

      newResponse.code(500);
      console.error(response);
      return newResponse;
    }

    return h.continue;
  });

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songService,
        validator: SongValidator,
      },
    },
    {
      plugin: albums,
      options: {
        service: albumService,
        validator: AlbumValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: userService,
        validator: UserValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        userService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: Playlists,
      options: {
        service: playlistService,
        songService,
        songInPlaylistService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: songinplaylist,
      options: {
        songInPlaylistService,
        playlistService,
        songService,
        validator: PlaylistValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
