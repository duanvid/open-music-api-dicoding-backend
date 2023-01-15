class AlbumLikesHandler {
  constructor(service, albumService) {
    this._service = service;
    this._albumService = albumService;
  }

  async postAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumService.getAlbumById(albumId);

    const liked = await this._service.checkAlbumLikes(credentialId, albumId);

    if (liked) {
      await this._service.deleteAlbumLikes(credentialId, albumId);

      const response = h.response({
        status: 'success',
        message: 'Berhasil menghapus like pada album',
      });

      response.code(201);
      return response;
    }

    await this._service.addAlbumLikes(credentialId, albumId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menyukai album',
    });

    response.code(201);
    return response;
  }

  async getAlbumLikesHandler(request) {
    const { id: albumId } = request.params;

    const likes = await this._service.getAlbumLikes(albumId);

    return {
      status: 'success',
      data: {
        likes,
      },
    };
  }
}

module.exports = AlbumLikesHandler;
