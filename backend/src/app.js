import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()


app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes import
import userRouter from './routes/user.routes.js'
import todoRouter from './routes/todo.routes.js'
import noteRouter from './routes/note.routes.js'
import labelRouter from './routes/label.routes.js'
import labelWithNoteRouter from './routes/labelwithnote.routes.js'





// user routes declaration
app.use("/", userRouter)

// note routes declaration
app.use("/note", noteRouter)

// label routes declaration
app.use("/label", labelRouter)

// label with note routes declaration
app.use("/label-with-note", labelWithNoteRouter)

// todo list routes declaration
app.use("/todos", todoRouter)



export { app }