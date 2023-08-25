const sequelize = require("sequelize")

const connection = new sequelize("coding_questions","root","javascript", {
    host: "localhost",
    dialect: "mysql"
})

module.exports = connection