import mysql from 'mysql2'

import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise()


export const allTasksByUser =  async (id) =>{
	const [tasks] = await pool.execute(`
		SELECT task_id, tname, comptime, completed, created_at, content, priority 
		FROM TASK 
		JOIN USER ON TASK.USER_ID = USER.ID
		WHERE USER.ID = (?)	
	`,[id])
	return tasks
}

export const createUser = async (id,name) =>{
	try {
		const [user] = await pool.execute(`
		INSERT INTO USER (ID, NAME) VALUES 
		(?, ?)
	`,[id,name])
		return user
	} catch (error) {
		console.log(error);
		return null
	}
}

export const checkUser = async (id) => {
	const [user] = await pool.execute(`
		SELECT * FROM USER WHERE ID = (?)
	`,[id])
	if(user.length === 0){
		return false
	}else{
		return true
	}
}

export const getTags = async (id) =>{
	let [tags] = await pool.execute(`
		SELECT TAG_NAME
		FROM TAGS
		WHERE TASK_ID = (?)
	`,[id])
	tags = tags.map((tag)=>tag.TAG_NAME)
	return tags
}

export const allTasksByUserFiltered =  async (id,tags) =>{
	let ques = tags.map((tag)=>'?').join(',')
	try{
	const [tasksid] = await pool.execute(`
		SELECT TASK.TASK_ID 
		FROM TASK
		JOIN TAGS ON TASK.TASK_ID = TAGS.TASK_ID
		WHERE user_id = (?)	AND TAGS.TAG_NAME IN ((${ques}))
	`,[id,...tags])
	const ids = tasksid.map((task)=>task.TASK_ID)
	const ques2 = ids.map((id)=>'?').join(',')
	const [tasks] = await pool.execute(`
		SELECT task_id, tname, comptime, completed, created_at, content, priority 
		FROM TASK 
		WHERE TASK_ID IN (${ques2})
		`,ids)
		return tasks
	}
	catch(error){
		console.log(error);
		return []
	}
}

export const completeTask =  async (id) =>{
	const [tasks] = await pool.execute(`
		UPDATE TASK
		SET COMPLETED = 1
		WHERE TASK_ID = (?)
	`,[id])
	return tasks
}

export const uncompleteTask =  async (task_id) => {
	const [tasks] = await pool.execute(`
		UPDATE TASK
		SET COMPLETED = 0
		WHERE TASK_ID = (?)
	`,[task_id])
	return tasks
}

export const createTask =  async (id,task,tags) => {
	const [tasks] = await pool.execute(`
	INSERT INTO task (user_id,tname, comptime, content, priority) VALUES 
	(?, ?, ?, ?, ?)
	`,[id,...task])
	if(tags !== undefined && tags != null){
		let taglist = []
		await Promise.all(tags = tags.map(async (tag) => {
			taglist.push( await pool.execute(`
				INSERT INTO tags (task_id, tag_name) VALUES 
				(?, ?)
			`,[tasks.insertId,tag])
				
			)
			return tag		
		}));
	}
	const [createdTask] = await pool.execute(`
	SELECT task_id, tname, comptime, completed, created_at, content, priority 
	FROM TASK 
	WHERE TASK_ID = (?)
	`,[tasks.insertId])
	return createdTask
}

export const updateCompTime = async (id,comptime) => {
	const [tasks] = await pool.execute(`
		UPDATE TASK
		SET COMPTIME = (?)
		WHERE TASK_ID = (?)
	`,[comptime,id])
	return tasks
}

export const deleteTask =  async (id) =>{
	const [tasks] = await pool.execute(`
		DELETE FROM TASK
		WHERE TASK_ID = (?)
	`,[id])
	return tasks
}
