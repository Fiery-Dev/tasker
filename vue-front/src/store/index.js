import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth:false,
    tasks: [],
    task_id: null,
    task_info: {},
    grabs: []
  },
  mutations: {
    setAuth(state, val){
      state.auth = val
    },
    setTasks(state){
      axios
          .post('http://' + window.location.hostname + ':3000/api/get-tasks')
          .then(response => {
            if (response.data.tasks){
              state.tasks = response.data.tasks
            }
          })
          .catch(error => {
            console.log(error);
          });

    },
    setTaskInfo(state){
      axios
          .post('http://' + window.location.hostname + ':3000/api/get-task',{
            id:state.task_id
          })
          .then(response => {
            state.task_info = response.data
          })
          .catch(error => {
            console.log(error);
            this.label = "ERROR"
            this.loaded = false;
          });
    },
    setTaskId(state, val){
      state.task_id = val
    },

    updCheckInfo(state, check){
      Vue.set(state.task_info.stats, 'id_'+check.id, check)
    },
    addTask(state, val){
      Vue.set(state.tasks, state.tasks.length, val)
    },

    setGrabs(state){
      axios
          .post('http://' + window.location.hostname + ':3000/api/get-grabs')
          .then(response => {
            state.grabs = response.data.grabs
          })
          .catch(error => {
            console.log(error);
            this.label = "ERROR"
            this.loaded = false;
          });
    },
    addGrab(state){
      axios
          .post('http://' + window.location.hostname + ':3000/api/add-grab')
          .then((resp) => {
            Vue.set(state.grabs, state.grabs.length, resp.data)
          })
          .catch(error => {
            console.log(error);
            this.label = "ERROR"
            this.loaded = false;
          });
    },
    updGrab(state,grab){
      axios
          .post('http://' + window.location.hostname + ':3000/api/upd-grab',{grab})
          .then(response => {
            console.log(response.data)
          })
          .catch(error => {
            console.log(error);
            this.label = "ERROR"
            this.loaded = false;
          });
    }
  },
  getters: {
    getAuth(state){
      return state.auth
    },
    getTasks(state){
      return state.tasks
    },
    getTaskId(state){
      return state.task_id
    },
    getTaskInfo(state){
      return state.task_info
    },

    getGrabs(state){
      return state.grabs
    }
  },
  actions:{
    actionSetTasks({ commit }) {
      commit('setTasks')
    },
    actionAddTask({ commit }, products){
      commit('addTask', products)
    },
    actionSetTaskInfo({ commit }){
      commit('setTaskInfo')
    },
    actionSetGrabs({ commit }){
      commit('setGrabs')
    }
  }
})
