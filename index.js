const express = require('express');
const path = require('path');
const fs = require('fs/promises');

const app = express();

app.use(express.json());

const jsonPath = path.resolve('./file/toDoList.json');

app.get('/tasks', async (req, res) => {
    const jsonToDoList = await fs.readFile(jsonPath, 'utf8');
    res.send(jsonToDoList);
});

app.post('/tasks', async (req, res) => {
    const task = req.body;
    const toDoList = JSON.parse(await fs.readFile(jsonPath, 'utf8'));
    const newId = toDoList[toDoList.length - 1].id + 1;

    if (task.title && task.description && task.status === true || task.status === false) {
        
        task.id = newId;
        toDoList.push(task);
        console.log(toDoList);

        await fs.writeFile(jsonPath, JSON.stringify(toDoList));
    }else {
        console.log('revisar parámetros');
    };

    res.end();
});

app.put('/tasks/:id', async (req, res) => {
    const url = req.url;
    const task = req.body;
    const toDoList = JSON.parse(await fs.readFile(jsonPath, 'utf8'));

    const idUrl = Number(url.replace('/tasks/', ''));
    const indexTask = toDoList.findIndex(taskIndex => taskIndex.id === idUrl);

    if (indexTask != -1) {        
        task.id = idUrl;   
        toDoList[indexTask] = task;     
        console.log(toDoList);
        await fs.writeFile(jsonPath, JSON.stringify(toDoList));
    }else {
        console.log('revisar parámetros');
    };

    res.end();
});

app.delete('/tasks/:id', async (req, res) => {
    const url = req.url;
    
    const toDoList = JSON.parse(await fs.readFile(jsonPath, 'utf8'));

    const idUrl = Number(url.replace('/tasks/', ''));
    const indexTask = toDoList.findIndex(taskIndex => taskIndex.id === idUrl);

    if (indexTask != -1) {        
    
        const newToDoList = toDoList.filter( task => task.id != idUrl);
        console.log(newToDoList);
        await fs.writeFile(jsonPath, JSON.stringify(newToDoList));
    }else {
        console.log('revisar parámetros');
    };

    res.end();
});

// obtener una tarea por id

app.get('/tasks/:id', async (req, res) => {
    const url = req.url;
    
    const toDoList = JSON.parse(await fs.readFile(jsonPath, 'utf8'));

    const idUrl = Number(url.replace('/tasks/', ''));
    const titleTask = toDoList.findIndex(taskTitle => taskTitle.title.replaceAll(" ", "").toUpperCase === url.replace('/tasks/', '').replaceAll('%20', '').toUpperCase);
    const indexTask = toDoList.findIndex(taskIndex => taskIndex.id === idUrl);

    if (indexTask != -1) {        
    
        const taskFound = toDoList[indexTask]
        console.log(taskFound);
        res.send(JSON.stringify(taskFound));

        


    }else if(titleTask != -1) {
        const taskFound = toDoList[titleTask]
        console.log(taskFound);
        // res.send(JSON.stringify(taskFound));


    }
    else {
        console.log('revisar parámetros');
    };

    res.end();
});

const PORT = 8000;

app.listen(PORT);