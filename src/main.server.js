import Vue from 'vue';
import App from './App.vue';

export default context => {
  return Promise.resolve(
    new Vue({
      render: h => h(App)
    })
  );
};
