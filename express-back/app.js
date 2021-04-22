const express = require('express')
const cors = require('cors');
const { Sequelize } = require('sequelize');
const pgp = require("pg-promise")(/*options*/);
const db = pgp("postgres://arturh_root:C7g0C9MW0500@194.61.2.215:5432/arturh_test");
const app = express()
const port = 3000

const sequelize = new Sequelize('arturh_test', 'arturh_root', 'C7g0C9MW0500', {
    host: '194.61.2.215',
    dialect: 'postgres'
});

const Stats = sequelize.define("stats", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    text: {
        type: Sequelize.STRING,
        allowNull: false
    },
    comment: {
        type: Sequelize.TEXT,
        allowNull: true
    },
    status: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
});

const Graber = sequelize.define("graber", {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    comment: {
        type: Sequelize.TEXT,
        allowNull: true
    }
});

const Tasker = sequelize.define("tasker", {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    comment: {
        type: Sequelize.STRING,
        allowNull: true
    }
});

Tasker.hasMany(Stats);

app.use(express.json())

app.use(cors({
    'Access-Control-Allow-Origin': '*'
}))

app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.get('/task/:id', (req, res) => {
    res.send('Hello World!')
})

app.post('/api/pass', (req, res) => {
    res.send({pass:'asd'})
})

app.post('/api/get-tasks', async (req, res) => {
    res.send({tasks: await getTasks()})
})

app.post('/api/get-task', async (req, res) => {
    res.send(await getTask(req.body.id))
})

app.post('/api/add-task', async (req, res) => {
    await addTask(req.body.task)
    res.send({success:true})
})

app.post('/api/upd-task', async (req, res) => {
    await updTask(req.body)
    res.send({success: true})
})

app.post('/api/add-check', async (req, res) => {
    res.send(await addCheck(req.body.id))
})

app.post('/api/del-check', async (req, res) => {
    await delCheck(req.body.id)
    res.send({success: true})
})

app.post('/api/get-grabs', async (req, res) => {
    res.send({grabs: await getGrabs()})
})

app.post('/api/add-grab', async (req, res) => {
    res.send(await addGrab())
})

app.post('/api/upd-grab', async (req, res) => {
    await updGrab(req.body.grab)
    res.send({success: true})
})



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})




async function addTask (id){
    await Tasker.create({id: id, comment: "Процесс разработки и отдачи истории в релиз"}).then(async res=>{
        const taskId = res.id;

        await Stats.create({text:"Пытаемся понять, что изменится", status: false, taskerId: taskId}).catch(err=>console.log(err));
        await Stats.create({text:"Разрабатываем", status: false, taskerId: taskId}).catch(err=>console.log(err));
        await Stats.create({text:"Пытаемся понять, что изменилось", status: false, taskerId: taskId}).catch(err=>console.log(err));
        await Stats.create({text:"Тестируем руками", status: false, taskerId: taskId}).catch(err=>console.log(err));
        await Stats.create({text:"Тестируем автотестами", status: false, taskerId: taskId}).catch(err=>console.log(err));
        await Stats.create({text:"Мердж-реквест", status: false, taskerId: taskId}).catch(err=>console.log(err));

    }).catch(err=>console.log(err));
}

async function getTask (id){
    const task = {};
    await Tasker.findByPk(id).then(async (taske)=>{
        if(!taske) return console.log("Company not found");
        task.id = id
        task.comment = taske.comment
        task.stats = {}
        await taske.getStats({
            order: [['id', 'ASC']]})
            .then(async (res)=>{
                res.forEach(stat => {
                    task.stats['id_'+stat.id] = {
                        id: stat.id,
                        text: stat.text,
                        status: stat.status,
                        comment: stat.comment
                    }
                })
            })
            .catch(err=>console.log(err));
    }).catch(err=>console.log(err));
    return task
}

async function updTask (task){
    await Tasker.update({comment: task.comment}, {
        where: {
            id: task.id
        }
    });
    for (let stat_id in task.stats){
        let stat = task.stats[stat_id]
        await Stats.update({
            text: stat.text,
            status: stat.status,
            comment: stat.comment
        }, {
            where: {
                id: stat.id,
                taskerId: task.id
            }
        });
    }
}

async function addCheck (task){
    let check = {}

    await Stats.create({text:"ШАГ НОВЫЙ", status: false, taskerId: task}).then(async res=> {
        check = {
            id: res.dataValues.id,
            text: res.dataValues.text,
            status: res.dataValues.status
        }
    }).catch(err=>console.log(err));
    return check
}

async function delCheck (check){
    await Stats.destroy({
        where: {
            id: check
        }
    });
}

async function getTasks (){
    return Tasker.findAll();
}

async function getGrabs (){
    return Graber.findAll();
}

async function addGrab (){
    let grab = {}
    await Graber.create({comment: "Новая грабля"}).then(async res=>{
        grab = res.dataValues
    }).catch(err=>console.log(err));
    return grab
}

async function updGrab (grab){
    await Graber.update({comment: grab.comment}, {
        where: {
            id: grab.id
        }
    });
}

// sequelize.sync({force:true}).then(()=>{
//     console.log("Tables have been created");
// }).catch(err=>console.log(err));
