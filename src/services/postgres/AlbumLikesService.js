const { nanoid } = require('nanoid');
const { Pool } = require('pg');
const InvariantError = require('../../exeptions/InvariantError');

class AlbumLikesService {
  constructor() {
    this._pool = new Pool();
  }

  async checkAlbumLikes(userId, albumId) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE user_id = $1 AND album_id = $2',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    return result.rows.length;
  }

  async deleteAlbumLikes(userId, albumId) {
    const query = {
      text: 'DELETE FROM user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id',
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal, id tidak ditemukan');
    }
  }

  async addAlbumLikes(userId, albumId) {
    const id = `albumlikes-${nanoid(8)}`;

    const query = {
      text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan like ke album');
    }
  }

  async getAlbumLikes(albumId) {
    const query = {
      text: 'SELECT id FROM user_album_likes WHERE album_id = $1',
      values: [albumId],
    };

    const result = await this._pool.query(query);

    return result.rows.length;
  }
}

module.exports = AlbumLikesService;
