class PlaylistActivitiesHandler {
  constructor(playlistActivitiesService, playlistService) {
    this._playlistAcvtivitiesService = playlistActivitiesService;
    this._playlistService = playlistService;
  }

  async getPlaylistActivitiesHandler(request) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    const activities = await this._playlistAcvtivitiesService.getPlaylistActivities(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities,
      },
    };
  }
}

module.exports = PlaylistActivitiesHandler;
