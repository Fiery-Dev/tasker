<template>
    <div>
        <label for="pass">{{label}}</label>
        <input id="pass" type="password" v-model="checkPass" v-if="loaded">
    </div>
</template>
<script>
import axios from 'axios';
import { mapMutations } from 'vuex'
export default{
    name: 'Pass',
    data(){
        return {
            checkPass: '',
            pass: '',
            label: "PASSWORD",
            loaded: false,
        }
    },
    created() {
        this.getPass()
    },
    methods:{
        ...mapMutations([
            'setAuth'
        ]),
        getPass (){
            axios
                .post('http://' + window.location.hostname + ':3000/api/pass')
                .then(response => {
                    this.pass = response.data.pass;
                    if (this.pass){
                        this.loaded = true;
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.label = "ERROR"
                    this.loaded = false;
                });
        }
    },
    watch:{
        checkPass(){
            if (this.checkPass === this.pass) {
                document.cookie = "goToProdBaby=OooohYeas";
                this.setAuth(true)
            }
        }
    }

}
</script>