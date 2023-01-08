const InvariantError = require('../../exeptions/InvariantError');
const { PlaylistPayloadSchema, PostSongToPlaylistPayloadSchema } = require('./schema');

const PlaylistValidator = {
  validatePlaylistPayload: (payload) => {
    const validationResult = PlaylistPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateSongToPlaylistPayload: (payload) => {
    const validationResult = PostSongToPlaylistPayloadSchema
      .validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;