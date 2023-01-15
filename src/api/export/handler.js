class ExportHandler {
  constructor(exportSerice, playlistService, validator) {
    this._exportService = exportSerice;
    this._playlistService = playlistService;
    this._validator = validator;
  }

  async postExportPlaylistHandler(request, h) {
    await this._validator.validateExportPlaylistPayload(request.payload);

    const { playlistId } = request.params;
    const { targetEmail } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

    const message = {
      playlistId,
      targetEmail,
    };

    await this._exportService.sendMessage('export:playlist', JSON.stringify(message));

    const response = h.response({
      status: 'success',
      message: 'Permintaan Anda sedang kami proses',
    });
    response.code(201);
    return response;
  }
}

module.exports = ExportHandler;
