<template>
  <div id="app">
    <div class="page">
      <div class="container">
        <div class="left">
          <img class="logo" src="./assets/logo.png" />
          <div class="player">
            <youtube
              @ended="songEnded"
              v-if="currentSong"
              :video-id="currentSong.videoId"
              :player-vars="{ autoplay: 1, controls: 1, showinfo: 0, cc_load_policy: 3, start: 0 }"
            />
          </div>
        </div>
        <div class="right">
          <div class="playlist">
            <div
              class="song-item"
              :class="{ 'active' : currentSong ? currentSong._id === song._id : false, 'disabled': force && !song.force, 'forced': song.force}"
              v-for="song in songs"
              :key="song.videoId"
              v-on:click="playSong(song)"
            >
              <img class="thumbnail" :src="song.thumbnail" />
              <a class="song-title">{{ song.title }}</a>
              <span v-if="song.force" class="starred">&#x2605;</span>
              <span class="username">@{{ song.requestedBy }}</span>
              <span class="time">{{ song.duration }}</span>
            </div>
          </div>
          <span class="footer">
            Made with
            <span class="icon">&#10084;</span> by samir.hodzic
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import io from 'socket.io-client';

export default {
  name: 'app',
  data() {
    return {
      force: false,
      songs: [],
      currentSong: {},
      socket: io.connect()
    };
  },
  methods: {
    songEnded: function() {
      let index = this.songs.findIndex(
        song => song._id === this.currentSong._id
      );
      if (this.force) {
        for (var i = index + 1; i < this.songs.length; i++) {
          if (this.songs[i].force) {
            this.currentSong = this.songs[i];
            break;
          }
        }
      } else {
        let _s = this.songs[this.songs.length - 1 < index + 1 ? 0 : index + 1];
        if (this.currentSong.videoId === _s.videoId) {
          this.currentSong = _s;
          this.songEnded();
          return;
        }

        this.currentSong = _s;
      }
    },
    playSong: function(song) {
      if (
        song._id === this.currentSong._id ||
        song.videoId === this.currentSong.videoId ||
        (this.force && !song.force)
      )
        return;
      this.currentSong = song;
    }
  },
  mounted() {
    this.socket.on('new_song', song => {
      this.songs.push(song);

      if (song.force) {
        this.force = true;
        if (!this.currentSong.force) this.currentSong = song;
      }
    });
    this.socket.on('first_playlist', data => {
      this.songs = data.songs;
      if (data.force) {
        this.force = true;
        for (var i = 0; i < this.songs.length - 1; i++) {
          if (this.songs[i].force) {
            if (!this.currentSong.videoId) this.currentSong = this.songs[i];
            break;
          }
        }
      } else {
        if (!this.currentSong.videoId) this.currentSong = this.songs[0];
      }
    });
    this.socket.on('force_done', song => {
      this.force = false;
      this.currentSong.force = false;
      this.songs.forEach(song => {
        song.force = false;
      });
    });
  }
};
</script>

<style lang="scss">
@import './assets/styles.scss';
</style>
