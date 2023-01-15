const InvariantError = require('../../exeptions/InvariantError');
const { PlaylistPayloadSchema, PostSongToPlaylistPayloadSchema, ExportPlaylistPayloadSchema } = require('./schema');

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
  validateExportPlaylistPayload: (payload) => {
    const validationResult = ExportPlaylistPayloadSchema
      .validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = PlaylistValidator;
