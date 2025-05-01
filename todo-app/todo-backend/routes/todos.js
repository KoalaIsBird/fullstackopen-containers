const express = require('express')
const { Todo } = require('../mongo')
const { setAsync, getAsync } = require('../redis')
const router = express.Router()

/* GET todos listing. */
router.get('/', async (_, res) => {
    const todos = await Todo.find({})
    res.send(todos)
})

/* POST todo to listing. */
router.post('/', async (req, res) => {
    const todo = await Todo.create({
        text: req.body.text,
        done: false
    })
    res.send(todo)
    const currentNewTodosCount = parseInt(await getAsync('added_todos'))
    await setAsync('added_todos', currentNewTodosCount ? currentNewTodosCount + 1 : 1)
})

const singleRouter = express.Router()

const findByIdMiddleware = async (req, res, next) => {
    const { id } = req.params
    req.todo = await Todo.findById(id)
    if (!req.todo) return res.sendStatus(404)

    next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
    await req.todo.delete()
    res.sendStatus(200)
})

/* GET todo. */
singleRouter.get('/', async (req, res) => {
    res.json(req.todo)
})

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
    const { done } = req.body
    if (done === true || done === false) {
        await Todo.findByIdAndUpdate(req.todo, { done: done })
        res.status(200).end()
        return
    }
    res.status(400).json({ error: 'field "done" was not specified' })
})

router.use('/:id', findByIdMiddleware, singleRouter)

module.exports = router
