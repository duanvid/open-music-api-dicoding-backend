const mapSongToDisplay = (song) => ({ id: song.id, title: song.title, performer: song.performer });

const mapPlaylistWithSong = (playlist) => ({
  id: playlist.id,
  name: playlist.name,
  username: playlist.username,
});

const mapAlbum = (album) => ({
  id: album.id,
  name: album.name,
  year: album.year,
  coverUrl: album.coverurl,
});

module.exports = { mapSongToDisplay, mapPlaylistWithSong, mapAlbum };
