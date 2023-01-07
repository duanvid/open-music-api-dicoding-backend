exports.up = (pgm) => {
  pgm.createTable('playlist_songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    playlist_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    song_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
  });
  pgm.addConstraint('playlist_songs', 'fk_playlist_song.playlist_id_playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlist(id) ON DELETE CASCADE');

  pgm.addConstraint('playlist_songs', 'fk_playlist_song.song_id_songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('playlist_songs', 'fk_playlist_song.song_id_song.id');

  pgm.dropConstraint('playlist_songs', 'fk_playlist_song.paylist_id_playlist.id');

  pgm.dropTable('playlist_songs');
};
