const { Pool } = require('pg');
const InvariantError = require('../../exeptions/InvariantError');

class AlbumCoverService {
  constructor() {
    this._pool = new Pool();
  }

  async putCoverUrlToAlbums(coverUrl, albumId) {
    const query = {
      text: 'UPDATE albums SET coverurl = $1 WHERE albums.id = $2 RETURNING albums.id',
      values: [coverUrl, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Gagal menambahkan coverurl');
    }
  }
}

module.exports = AlbumCoverService;
