import express from 'express'

import * as db from './dbms.js'

const app = express()
app.use(express.json())

const getTaskWithTags = async (tasks) => {
    const tasksWithTags = await Promise.all(tasks.map(async (task)=>{
        const tags = await db.getTags(task.task_id)
        return {...task,tags}
    }))
    return tasksWithTags
}
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
})

app.get('/tasks/:id', async (res,req) => {
    const id = res.params.id
    const tasks = await db.allTasksByUser(id)
    const tasksWithTags = await getTaskWithTags(tasks)
    req.send(tasksWithTags)
})

app.post('/tasks/user/:id/create', async (res,req) => {
    const id = res.params.id
    const {name} = res.body
    const userExists = await db.checkUser(id)
    if(userExists){
        req.status(202).send({message:'User already exists'})
    }else{
        const user = await db.createUser(id,name)
        req.status(201).send(user)
    }
})



app.get('/tasks/:id/:tags', async (res,req) => {
    const id = res.params.id
    const tags = res.params.tags.split(',')
    const tasks = await db.allTasksByUserFiltered(id,tags)
    const tasksWithTags = await getTaskWithTags(tasks)
    req.send(tasksWithTags)
})

app.post('/tasks/:id/create', async (res,req) => {
    const id = res.params.id
    const {task,tags} = res.body
    const tasks = await db.createTask(id,task,tags)
    const [tasksWithTags] = await getTaskWithTags(tasks)
    req.status(201).send(tasksWithTags)
})

app.put('/tasks/:task_id/updateTime', async (res,req) => {
    const task_id = res.params.task_id
    const {comptime} = res.body
    const tasks = await db.updateCompTime(task_id,comptime)
    req.send(tasks)
});

app.put('/tasks/:task_id/complete', async (res,req) => {
    const task_id = res.params.task_id
    const tasks = await db.completeTask(task_id)
    req.send(tasks)
})

app.put('/tasks/:task_id/uncomplete', async (res,req) => {
    const task_id = res.params.task_id
    const tasks = await db.uncompleteTask(task_id)
    req.send(tasks)
})


app.delete('/tasks/:task_id/delete', async (res,req) => {
    const task_id = res.params.task_id
    const tasks = await db.deleteTask(task_id)
    req.send(tasks)
})

app.listen(8080, ()=> {
    console.log('Server is listening on port 8080 http://localhost:8080/')
})