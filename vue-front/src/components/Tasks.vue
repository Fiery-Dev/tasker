<template>
    <div class="d-flex col-1 flex-column">
        <task_list/>
        <task_add/>
    </div>
</template>
<script>
import task_list from './tasks/TasksList'
import task_add from './tasks/TaskAdd'

export default {
    name: "Tasks",
    data(){
        return {
            tasks: true
        }
    },
    components:{
        task_list,
        task_add
    }
}
</script>