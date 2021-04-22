<template>
    <div class="d-flex flex-column col-6 pr-0">
        <a class="h2 text-secondary" :href="'https://jira.oooinex.ru/browse/PIRS2018-'+task_info.id">JIRA-{{task_info.id}}</a>
        <input class="border-0 h3" v-model="task_info.comment">
        <ul class="w-100 px-0">
            <li
                v-for="info in task_info.stats" :key="info.id"
                class="d-flex align-items-center justify-content-between mb-2 w-100 border-dark border-bottom flex-wrap"
            >
                <span class="col-10 font-weight-bold" :class="{'d-none': dNone === info.id}"  @click="editText(info.id)">{{info.text}}</span>
                <textarea class="col-10" :id="info.id" type="text" :class="{'d-none': dNone !== info.id}" v-model="info.text" @blur="saveText(info.id)"></textarea>

                <div class="col-2 px-0 d-flex align-items-center justify-content-end" >
                    <button class="addComment btn-secondary mr-auto" @click="editComment(info.id)" :class="{'d-none': info.comment !== null && info.comment !== ''}">
                       <span>></span>
                    </button>
                    <input class="checkbox" :id="'checkbox'+info.id" type="checkbox" v-model="info.status">
                    <button
                        class="btn-danger ml-3"
                        @click="delCheck(info.id)"
                    >DEL</button>
                </div>
                <span class="col-12 pl-5" :class="{'d-none': info.comment === null || (dNoneComment === info.id && info.comment !== null) }" @click="editComment(info.id)">
                    {{info.comment}}
                </span>
                <textarea class="col-12 pl-5" v-model="info.comment" :class="{'d-none': dNoneComment !== info.id }"  @blur="saveComment(info.id)">

                </textarea>
            </li>
        </ul>
        <div class="d-flex w-100 justify-content-between">
            <button
                class="btn-dark mr-3"
                @click="addCheck()"
            >
                Добавить чек
            </button>
            <button
                class="btn-success"
                @click="saveTask()"
            >Сохранить</button>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import {mapGetters, mapMutations} from 'vuex'
import store from "../store";

export default {
    name:'Task',
    data:()=>({
        task_id: null,
        task_info: {},
        dNone: null,
        dNoneComment: null,
        opComment: null,
    }),
    computed: {
        ...mapGetters([
            'getTaskId',
            'getTaskInfo'
        ]),
    },
    watch:{
        getTaskId(){
            this.task_id = this.getTaskId
        },
        task_id(){
            store.dispatch('actionSetTaskInfo')
        },
        getTaskInfo(){
            this.task_info = this.getTaskInfo
            console.log(this.task_info)
        }
    },
    methods:{
        ...mapMutations([
            'updCheckInfo',
        ]),
        editText(id){
          this.dNone = id
        },
        saveText(id){
          if (id === this.dNone){
              this.dNone = null
          }
        },
        editComment(id){
            console.log(this.dNoneComment)
          this.dNoneComment = id
        },
        saveComment(id){
            if (id === this.dNoneComment){
                this.dNoneComment = null
            }
        },
        addCheck(){
            axios
                .post('http://' + window.location.hostname + ':3000/api/add-check',{
                    id:this.task_id
                })
                .then(response => {
                    this.updCheckInfo(response.data)
                })
                .catch(error => {
                    console.log(error);
                    this.label = "ERROR"
                    this.loaded = false;
                });
        },
        delCheck(id){
            delete this.task_info.stats['id_'+id];
            axios
                .post('http://' + window.location.hostname + ':3000/api/del-check', {id:id})
                .then(response => {
                    if (response.data.success === true){
                        console.log('success');
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.label = "ERROR"
                    this.loaded = false;
                });
            this.task_info = Object.assign({}, this.task_info)
        },
        saveTask(){
            axios
                .post('http://' + window.location.hostname + ':3000/api/upd-task', this.task_info)
                .then(response => {
                    if (response.data.success === true){
                        console.log('success');
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.label = "ERROR"
                    this.loaded = false;
                });
        }
    },
}
</script>
<style lang="scss">
.addComment{
    width: 30px;
    height: 30px;
    span{
        display: block;
        font-size: 18px;
        font-weight: bolder;
        transform: rotate(90deg);
    }
}
.checkbox{
    transform:scale(2.3);
    opacity:0.9;
    cursor:pointer;
}
</style>