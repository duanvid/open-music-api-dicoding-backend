const mapSongToDisplay = (song) => ({ id: song.id, title: song.title, performer: song.performer });

const mapPlaylistWithSong = (playlist) => ({
  id: playlist.id,
  name: playlist.name,
  username: playlist.username,
});

module.exports = { mapSongToDisplay, mapPlaylistWithSong };
