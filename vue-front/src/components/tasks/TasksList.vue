<template>
    <div>
        <h4>Задачи</h4>
        <ul class="pl-3">
            <li v-for="(task,id) in tasks" :key="id">
                <router-link :to="'/task/'+task.id" class="h5 text-secondary"> {{task.id}}</router-link>
            </li>
        </ul>
    </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
// import store from "@/store";

export default{
    data:()=>({
        tasks: [],
        curTask: null
    }),
    computed: {
        ...mapGetters([
            'getTasks',
        ]),
    },
    watch:{
        getTasks: {
            handler: function (){
                this.tasks = this.getTasks
            },
            deep: true
        },
        $route(to) {
            this.curTask = to.path.replace('/task/', '')
        },
        curTask(){
            this.setTaskId(this.curTask)
        }
    },
    mounted() {
        this.curTask = this.$route.fullPath.replace('/task/', '')
    },
    methods:{
        ...mapMutations([
            'setTaskId'
        ]),
    }

}
</script>
<style lang="scss">
.text-secondary.router-link-active{
    color: red !important;
}
</style>