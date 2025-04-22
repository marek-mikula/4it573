import { drizzle } from "drizzle-orm/libsql"
import { todosTable } from "./schema.js"
import { eq } from "drizzle-orm"

export const db = drizzle({
  connection: process.env.NODE_ENV === "test" ? "file::memory:" : "file:db.sqlite",
  logger: process.env.NODE_ENV !== "test"
})

export const getAllTodos = async () => {
  const todos = await db
    .select()
    .from(todosTable)
    .all()

  return todos
}

export const getTodoById = async (id) => {
  const todo = await db
    .select()
    .from(todosTable)
    .where(eq(todosTable.id, id))
    .get()

  return todo
}

export const storeTodo = async (data) => {
  const todos = await db.insert(todosTable).values(data).returning({ id: todosTable.id })
  return todos[0].id
}

export const updateTodoById = async (id, data) => {
  await db
    .update(todosTable)
    .set(data)
    .where(eq(todosTable.id, id))
}

export const deleteTodoById = async (id) => {
  await db.delete(todosTable).where(eq(todosTable.id, id))
}