class UploadHandler {
  constructor(service, coverService, validator) {
    this._service = service;
    this._coverService = coverService;
    this._validator = validator;
  }

  async postUploadAlbumCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id: albumId } = request.params;

    await this._validator.validateImageHeaders(cover.hapi.headers);

    const filename = await this._service.writeFile(cover, cover.hapi);
    const fileLocation = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;

    await this._coverService.putCoverUrlToAlbums(fileLocation, albumId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan cover album',
      data: {
        fileLocation,
      },
    });

    response.code(201);
    return response;
  }
}

module.exports = UploadHandler;
