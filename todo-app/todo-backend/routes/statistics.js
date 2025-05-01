const express = require('express')
const { getAsync } = require('../redis')

const statisticsRouter = express.Router()

statisticsRouter.get('/', async (req, res) => {
    const counter = parseInt(await getAsync('added_todos'))
    res.json({added_todos: counter ? counter : 0})
})

module.exports = statisticsRouter