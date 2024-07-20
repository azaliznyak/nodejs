const express = require('express');
// const user = require("express/lib/view");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = [
    {id:0,name: 'vasya', age: 31, status: false},
    {id:1,name: 'petya', age: 30, status: true},
    {id:2,name: 'kolya', age: 29, status: true},
    {id:3,name: 'olya', age: 28, status: false},
    {id:4,name: 'max', age: 30, status: true},
    {id:5,name: 'anya', age: 31, status: false},
    {id:6,name: 'oleg', age: 28, status: false},
    {id:7,name: 'andrey', age: 29, status: true},
    {id:8,name: 'masha', age: 30, status: true},
    {id:9,name: 'olya', age: 31, status: false},
    {id:10,name: 'max', age: 31, status: true}
];

app.get('/users', (req, res) => {
   try {
    res.json(users);

   }catch(e) {
       res.status(400).json(e.message);
   }
})
app.post('/users', (req, res) => {
   try {
       const {name, age, status} = req.body;
       const index=users.findIndex((user)=>user.name === name);
       if (index !==1) {    //означає, що юзер знайшовся
           return res.status(409).json("User with this name already exists");
       }
       const newUser = {
           id: users[users.length-1].id + 1,
           name,
           age,
           status
       };
       users.push(newUser);
       res.status(201).json(newUser);
   }catch(e) {
       res.status(400).json(e.message);
   }

})
app.get('/users/:userId', (req, res) => {
   try {
       const user=users.find(user=>user.id===+req.params.userId)
       if (!user) {
           return res.status(404).json({message: 'user not found'});
       }
       res.json(user)
   }catch(e) {
       res.status(400).json(e.message);
   }
})
app.put('/users/:userId', (req, res) => {
    try {
        const userId=Number(req.params.userId);
        const {name, age, status} = req.body;
       const user=users.find(user=>user.id === userId);
       if (!user) {
           return res.status(404).json({message: 'user not found'});
       }
       if (name){
       user.name = name;
       }
       if (age){
           user.age = age;
       }
       if (status){
           user.status = status;
       }

       res.status(201).json(user)

    }catch(e) {
        res.status(400).json(e.message);
    }
})
app.delete('/users/:userId', (req, res) => {
    try {
        const userId=Number(req.params.userId)
        const index=users.findIndex((user)=>user.id === userId);
        if (index === -1) { // якщо не знайшли
            return res.status(404).json({message: 'user not found'});
        }
        users.splice(index, 1);  //якщо все ок
        res.sendStatus(204)

    }catch(e) {
        res.status(400).json(e.message);
    }
})


app.listen(3000, ()=>{
    console.log("Listening on port 3000");
})