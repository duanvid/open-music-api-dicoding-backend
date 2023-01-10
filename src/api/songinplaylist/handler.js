class SongInPlaylistHandler {
  constructor(
    songInPlaylistService,
    playlistService,
    songService,
    activitiesService,
    validator,
  ) {
    this._songInPlaylistService = songInPlaylistService;
    this._playlistService = playlistService;
    this._songService = songService;
    this._activitiesService = activitiesService;
    this._validator = validator;
  }

  async postSongToPlaylistHandler(request, h) {
    await this._validator.validateSongToPlaylistPayload(request.payload);

    const { songId } = request.payload;
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._songService.getSongById(songId);
    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);

    const playlistSongId = await this._songInPlaylistService.addSongToPlaylist(songId, playlistId);
    await this._activitiesService.addSongActivity(playlistId, songId, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Berhasil menambahkan lagu ke dalam playlist',
      data: {
        playlistSongId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongInPlaylistHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);

    const thePlaylist = await this._playlistService.getPlaylistById(playlistId);
    const songs = await this._songInPlaylistService.getSongsInPlaylist(playlistId);

    const playlist = {
      id: thePlaylist.id,
      name: thePlaylist.name,
      username: thePlaylist.username,
      songs,
    };

    return {
      status: 'success',
      data: {
        playlist,
      },
    };
  }

  async deleteSongInPlaylistHandler(request) {
    await this._validator.validateSongToPlaylistPayload(request.payload);
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    await this._songInPlaylistService.deleteSongInPlaylist(songId, playlistId);
    await this._activitiesService.deleteSongActivity(playlistId, songId, credentialId);

    return {
      status: 'success',
      message: 'Berhasil menghapus lagu dari playlist',
    };
  }
}

module.exports = SongInPlaylistHandler;
