const express = require("express") //importing Express
const app = express() //starting Express
const bodyParser = require("body-parser") //importing body-parser
const connection = require("./database/database")
const questionModel = require("./database/Question")
const answerModel = require("./database/Answer")

// Database
connection
    .authenticate()
    .then(() => {
        console.log('Successfully connected to the Data Base')
    })
    .catch((error) => {
        console.log(error)
    })

// Setting and using Express as View Engine
app.set('view engine', 'ejs')
app.use(express.static("public"))

// Using body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// Routes
app.get("/",(req,res) => {
    questionModel.findAll({raw: true, order: [
        ["id", "DESC"]
    ]}).then(question => {
        res.render("index.ejs", {
            question: question
        })
    })
})

app.get("/questioning",(req,res) => {
    res.render("questioning.ejs")
})

app.post("/questionsaved",(req,res) => {
    let title = req.body.title
    let description = req.body.description
    questionModel.create({
        title: title,
        description: description
    }).then(() =>{
        res.redirect("/")
    })
})

app.get("/question/:id",(req,res) => {
    let id = req.params.id;
    questionModel.findOne({
        where: {id: id}
    }).then(question => {
        if(question != undefined) {
            answerModel.findAll({
                where: {questionId: question.id},
                order: [ 
                    ["id","DESC"] 
                ]
            }).then(answer => {
                res.render("question.ejs", {
                    question: question,
                    answer: answer
                }) 
            })
        } else {
            res.redirect("/")
        }
    })
})

app.post("/answer",(req,res) => {
    let bodyAnswer = req.body.bodyAnswer
    let questionId = req.body.questionId
    answerModel.create({
        bodyAnswer: bodyAnswer,
        questionId: questionId
    }).then(() =>{
        res.redirect("/question/"+questionId)
    })
})

app.listen(3000,(error)=>{
    if(error){
        console.log('There was an error while initializing your server.')
    } else {
        console.log('Succesfully initialized server in localhost:3000')
    }
})