const express = require("express")
const mongoose = require("mongoose")
const userRoutes = require("./routes/userRoutes")
const logger = require("./middleware/logger")

const app = express()
const PORT = 8000

mongoose.connect("mongodb://127.0.0.1:27017/user-1")
    .then(() => console.log("MongoDb Connected"))
    .catch((err) => console.log(`MongoDb Err ${err}`))

app.use(express.json())
app.use(logger)
app.use(userRoutes)

app.listen(PORT, () => console.log(`Server Started at PORT ${PORT}`))