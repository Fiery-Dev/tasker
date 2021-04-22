<template>
    <div class="col-5 pl-5 d-flex flex-column">
        <h2 class="text-center">GRABLIST</h2>
        <ul class="w-100 pl-1 list-unstyled">
            <li v-for="(grab,id) in grabs" :key="id"
                class="w-100 d-flex">
                <textarea class="col-11 p-0" v-model="grab.comment" type="text"></textarea>
                <button
                    class="btn-success"
                    @click="saveGrab(id)"
                >SAVE</button>
            </li>
        </ul>
        <button
            class="btn-dark"
            @click="addGrab()"
        >
            Добавить граблю
        </button>
    </div>
</template>
<script>
import { mapGetters, mapMutations} from 'vuex'
import store from "../store";
export default{
    name: 'Grablist',
    data:()=>({
        grabs:[]
    }),
    methods:{
        ...mapMutations([
            'addGrab',
            'updGrab'
        ]),
        saveGrab(id){
            this.updGrab(this.grabs[id])
        }
    },
    computed: {
        ...mapGetters([
            'getGrabs',
        ]),
    },
    watch:{
        getGrabs(){
            this.grabs = this.getGrabs
        }
    },
    created() {
        store.dispatch('actionSetGrabs')
    }
}
</script>