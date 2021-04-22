<template>
    <div class="d-flex flex-column">
        <input class="w-100" placeholder="PIRS2018-" id="taskAdd" v-model="add" type="number">
        <button class="btn-primary" @click="addTask">Новая задача</button>
    </div>
</template>
<script>
import axios from 'axios'
import store from '@/store'
import {mapMutations} from "vuex";

export default {
    data:()=>({
        add:'',
    }),
    methods:{
        addTask(){
            if (this.add !== ''){
                axios
                    .post('http://' + window.location.hostname + ':3000/api/add-task',
                        {
                            task: this.add
                        })
                    .then(response => {
                        if (response.data.success){
                            this.$router.push('/task/'+this.add)
                            this.add = '';
                        }
                    })
                    .catch(error => {
                        console.log(error);
                    });
                store.dispatch('actionAddTask', {
                    id: this.add
                })
            }
        },
        ...mapMutations([
            'setTaskId'
        ]),
    }
}

</script>