const { Pool } = require("pg");

class PlaylistService {
    constructor() {
        this._pool = new Pool();

        this.getPlaylistById = this.getPlaylistById.bind(this);
    }

    async getPlaylistById(playlistId) {
        const playlistQuery = {
            text: `SELECT * FROM playlist WHERE playlist.id = $1`,
            values: [playlistId],
        }

        const songQuery = {
            text: `SELECT playlist_songs.*, songs.title, songs.performer
            FROM playlist_songs
            JOIN songs ON songs.id = playlist_songs.song_id
            WHERE playlist_songs.playlist_id = $1`,
            values: [playlistId]
        }

        const playlistResult = await this._pool.query(playlistQuery);
        const songResult = await this._pool.query(songQuery)

        const playlist = {
            id: playlistResult.rows[0].id,
            name: playlistResult.rows[0].name,
            songs: songResult.rows.map((song) => ({ id: song.song_id, title: song.title, performer: song.performer }))
        }

        return {
            playlist,
        }
    }
}

module.exports = PlaylistService;
