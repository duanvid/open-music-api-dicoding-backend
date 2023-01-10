const { nanoid } = require('nanoid');
const { Pool } = require('pg');

class ActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistActivities(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title,
      playlist_song_activities.action, playlist_song_activities.time
      FROM playlist_song_activities
      INNER JOIN playlist ON playlist_song_activities.playlist_id = playlist.id
      INNER JOIN songs ON playlist_song_activities.song_id = songs.id
      INNER JOIN users ON playlist_song_activities.user_id = users.id
      WHERE playlist_song_activities.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }

  async addSongActivity(playlistId, songId, userId) {
    const activityId = `activity-${nanoid(16)}`;
    const time = new Date();
    const action = 'add';
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)',
      values: [activityId, playlistId, songId, userId, action, time],
    };

    await this._pool.query(query);
  }

  async deleteSongActivity(playlistId, songId, userId) {
    const activityId = `activity-${nanoid(16)}`;
    const time = new Date();
    const action = 'delete';
    const query = {
      text: 'INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6)',
      values: [activityId, playlistId, songId, userId, action, time],
    };

    await this._pool.query(query);
  }
}

module.exports = ActivitiesService;
