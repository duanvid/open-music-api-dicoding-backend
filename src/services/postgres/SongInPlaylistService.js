const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exeptions/InvariantError');
const NotFoundError = require('../../exeptions/NotfoundError');
const { mapSongToDisplay } = require('../../utils');

class SongInPlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addSongToPlaylist(songId, playlistId) {
    const id = `playlist-song-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Lagu gagal ditambahkan kedalam playlist');
    }

    return result.rows[0].id;
  }

  async getSongsInPlaylist(playlistId) {
    const query = {
      text: `SELECT playlist_songs.*, songs.title, songs.performer
      FROM playlist_songs
      JOIN songs ON songs.id = playlist_songs.song_id
      WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows.map(mapSongToDisplay);
  }

  async deleteSongInPlaylist(songId, playlistId) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song_id = $1 AND playlist_id = $2 RETURNING id',
      values: [songId, playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menghapus lagu dari playlist');
    }
  }
}

module.exports = SongInPlaylistService;
