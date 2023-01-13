class CollaborationHandler {
  constructor(collaborationsService, playlistService, userService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistService = playlistService;
    this._userService = userService;
    this._validator = validator;
  }

  async postCollaborationHandler(request, h) {
    await this._validator.validateCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.getPlaylistById(playlistId);
    await this._userService.getUserById(userId);
    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

    const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

    const response = h.response({
      status: 'success',
      data: {
        collaborationId,
      },
    });

    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._collaborationsService.deleteCollaboration(playlistId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationHandler;