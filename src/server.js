require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

const songs = require('./api/song');
const SongService = require('./services/postgres/SongService');
const SongValidator = require('./validator/song');

const albums = require('./api/album');
const AlbumServices = require('./services/postgres/AlbumService');
const AlbumValidator = require('./validator/albums');

const users = require('./api/users');
const UserService = require('./services/postgres/UserService');
const UserValidator = require('./validator/users');

const Playlists = require('./api/playlists');
const PlaylistService = require('./services/postgres/PlaylistService');
const PlaylistValidator = require('./validator/playlist');

const songinplaylist = require('./api/songinplaylist');
const SongInPlaylistService = require('./services/postgres/SongInPlaylistService');

const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationValidator = require('./validator/collaborations');

const playlistactivities = require('./api/playlistactivities');
const ActivitiesService = require('./services/postgres/ActivitiesService');

const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationsService');
const AuthenticationsValidator = require('./validator/authentications');

const _exports = require('./api/export');
const ProducerService = require('./services/rabbitmq/ProducerService');

const ClientError = require('./exeptions/ClientError');
const TokenManager = require('./tokenize/TokenManager');
const StorageService = require('./services/storage/StorageService');
const upload = require('./api/upload');
const UploadValidator = require('./validator/uploads');
const AlbumCoverService = require('./services/postgres/AlbumCoverService');

const init = async () => {
  const songService = new SongService();
  const albumService = new AlbumServices();
  const userService = new UserService();
  const authenticationsService = new AuthenticationsService();
  const songInPlaylistService = new SongInPlaylistService();
  const playlistActivitiesService = new ActivitiesService();
  const collaborationsService = new CollaborationsService();
  const playlistService = new PlaylistService(collaborationsService);
  const producerService = ProducerService;
  const storageService = new StorageService(path.resolve(__dirname, 'api/upload/file/images'));
  const coverService = new AlbumCoverService();

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
    {
      plugin: Inert,
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
        activitiesService: playlistActivitiesService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: playlistactivities,
      options: {
        playlistActivitiesService,
        playlistService,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistService,
        userService,
        validator: CollaborationValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        exportService: producerService,
        playlistService,
        validator: PlaylistValidator,
      },
    },
    {
      plugin: upload,
      options: {
        service: storageService,
        coverService,
        validator: UploadValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
