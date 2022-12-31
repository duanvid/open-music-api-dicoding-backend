require('dotenv').config();

const Hapi = require('@hapi/hapi');
const songs = require('./api/Music');
const albums = require('./api/album');
const AlbumServices = require('./services/postgres/AlbumService');
const AlbumValidator = require('./validator/albums');
const SongValidator = require('./validator/song');
const SongService = require('./services/postgres/SongService');
const ClientError = require('./exeptions/ClientError');

const init = async () => {
  const songService = new SongService();
  const albumService = new AlbumServices();

  const server = Hapi.Server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

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
      return newResponse;
    }

    return h.continue;
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
    }]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
