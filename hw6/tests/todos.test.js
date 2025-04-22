import test from "ava"
import { migrate } from "drizzle-orm/libsql/migrator"
import { todosTable } from "../src/schema.js"
import { db, deleteTodoById, getAllTodos, getTodoById, storeTodo, updateTodoById } from "../src/db.js"
import { eq } from "drizzle-orm"

test.before("run migrations", async () => {
  await migrate(db, { migrationsFolder: "drizzle" })
})

test.beforeEach("clean table", async () => {
  await db.delete(todosTable)
})

test.serial("getAllTodos returns all todos", async (t) => {
  await db
    .insert(todosTable)
    .values([
      { title: "Todo 1", done: false },
      { title: "Todo 2", done: true }
    ])

  const todos = await getAllTodos()

  t.is(todos.length, 2)
  t.is(todos[0].title, 'Todo 1')
  t.is(todos[1].title, 'Todo 2')
})

test.serial("getTodoById returns correct todo", async (t) => {
  const storedTodos = await db
    .insert(todosTable)
    .values({ title: "Todo 1", done: false })
    .returning({ id: todosTable.id })

  const todo = await getTodoById(storedTodos[0].id)

  t.is(todo.title, "Todo 1")
})

test.serial("storeTodo correctly stores todo", async (t) => {
  const id = await storeTodo({
    title: "Todo 1",
    done: true
  })

  const todo = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.id, id))
    .get()

  t.is(todo.title, "Todo 1")
})

test.serial("updateTodoById correctly updates todo", async (t) => {
  const storedTodos = await db
    .insert(todosTable)
    .values({ title: "Todo 1", done: false })
    .returning({ id: todosTable.id })

  await updateTodoById(storedTodos[0].id, {
    title: 'Todo 2',
    done: true,
  })

  const todo = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.id, storedTodos[0].id))
    .get()

  t.is(todo.title, 'Todo 2')
})

test.serial("deleteTodoById correctly deletes todo", async (t) => {
  const storedTodos = await db
    .insert(todosTable)
    .values({ title: "Todo 1", done: false })
    .returning({ id: todosTable.id })

  await deleteTodoById(storedTodos[0].id)

  const todo = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.id, storedTodos[0].id))
    .get()

  t.false(!!todo)
})
