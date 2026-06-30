const express = require("express")
const users = require("./MOCK_DATA.json")
const app = express()
const PORT = 8000

app.use(express.json())

//  Routes 

app.get("/users" , (req , res) =>{
    const html = `
    <ul>
    ${users.map((user)=> `<li>${user.first_name}</li>`)}
    </ul>
    `
    res.send(html);
});

app.get("/api/users" , (req  , res)=>{
    return res.json(users)
});


app.route('/api/users/:id')
    .get((req, res) => {
        const id = Number(req.params.id)
        const user = users.find((user) => user.id === id)
        if (!user) return res.status(404).json({ error: 'User not found' })
        return res.json(user)
    })
    .patch((req, res) => {
        const id = Number(req.params.id)
        const user = users.find((u) => u.id === id)
        if (!user) return res.status(404).json({ error: 'User not found' })

        const updates = req.body
        Object.assign(user, updates)
        return res.json(user)
    })
    .delete((req, res) => {
        const id = Number(req.params.id)
        const idx = users.findIndex((u) => u.id === id)
        if (idx === -1) return res.status(404).json({ error: 'User not found' })

        const removed = users.splice(idx, 1)[0]
        return res.json({ status: 'deleted', user: removed })
    })

    app.post("/api/users" , (req , res)=>{
    const data = req.body
    if (!data || Object.keys(data).length === 0) {
        return res.status(400).json({ error: "Missing user data" })
    }

    const maxId = users.reduce((max, u) => (u.id > max ? u.id : max), 0)
    const newUser = { id: maxId + 1, ...data }
    users.push(newUser)
    return res.status(201).json(newUser)
});




app.listen(PORT , ()=> console.log(`Server Started at PORT ${PORT}`))