import {serve} from '@hono/node-server'
import {Hono} from 'hono'
import {renderFile} from 'ejs'

const todos = [
    {
        id: 1,
        title: 'Zajit na pivo',
        done: false,
    },
    {
        id: 2,
        title: 'Doplnit skripty',
        done: false,
    },
]

const app = new Hono()

app.get('/', async (c) => {
    const rendered = await renderFile('src/views/index.html', {
        title: 'Todos app',
        todos,
    })

    return c.html(rendered)
})

app.post('/todos', async (c) => {
    const form = await c.req.formData()

    todos.push({
        id: todos.length + 1,
        title: form.get('title') as string,
        done: false,
    })

    return c.redirect('/')
})

app.get('/todos/:id/toggle', async (c) => {
    const id = Number(c.req.param('id'))
    const referer = c.req.header('Referer') || '/'

    const todo = todos.find((todo) => todo.id === id)

    if (!todo) return c.notFound()

    todo.done = !todo.done

    if (/\/todos\/[0-9]+/.test(referer)) {
        return c.redirect(`/todos/${todo.id}`)
    }

    return c.redirect('/')
})

app.get('/todos/:id/remove', async (c) => {
    const id = Number(c.req.param('id'))

    const index = todos.findIndex((todo) => todo.id === id)

    if (index === -1) return c.notFound()

    todos.splice(index, 1)

    return c.redirect('/')
})

app.get('/todos/:id', async (c) => {
    const id = Number(c.req.param('id'))

    const todo = todos.find((todo) => todo.id === id)

    if (!todo) return c.notFound()

    const rendered = await renderFile('src/views/detail.html', {
        title: todo.title,
        todo,
    })

    return c.html(rendered)
})

app.post('/todos/:id', async (c) => {
  const id = Number(c.req.param('id'))

  const todo = todos.find((todo) => todo.id === id)

  if (!todo) return c.notFound()

  const form = await c.req.formData()

  todo.title = form.get('title') as string

  return c.redirect(`/todos/${todo.id}`)
})

serve({
    fetch: app.fetch,
    port: 3000
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`)
})
