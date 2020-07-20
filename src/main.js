import Vue from 'vue';
import App from './App.vue';
import VueYouTubeEmbed from 'vue-youtube-embed';

Vue.use(VueYouTubeEmbed);

new Vue({
  el: '#app',
  render: h => h(App)
});
