<template>
  <div id="app">
    <auth v-if="!auth"/>
    <div class="d-flex" v-else>
      <tasks />
      <router-view />
      <grablist />
    </div>
  </div>
</template>

<script>
import store from './store'
import Auth from "./views/Auth";
import Grablist from "./views/Grablist";
import {mapGetters} from 'vuex'
import Tasks from '@/components/Tasks.vue'

export default {
  data (){
    return {
      auth: false
    }
  },
  computed: {
    ...mapGetters([
      'getAuth',
    ]),
  },
  created() {
    if (this.getCookie('goToProdBaby') === 'OooohYeas'){
      this.auth = true
      store.dispatch('actionSetTasks')
    }
  },
  watch:{
    getAuth(){
      this.auth = this.getAuth
    }
  },
  components:{
    Auth,
    Tasks,
    Grablist
  },
  methods:{
    getCookie(name) {
      let matches = document.cookie.match(new RegExp(
              "(?:^|; )" + name.replace(/([\\.$?*|{}\\(\\)\\[\\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
      ));
      return matches ? decodeURIComponent(matches[1]) : undefined;
    }
  }

}
</script>

<style lang="scss">

</style>
