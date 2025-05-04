import { test, expect } from "@playwright/test"

test("index page has title", async ({ page }) => {
  await page.goto("/")

  await expect(page.getByText("MY TODO APP")).toBeDefined()
})

test("form on index page creates new todos", async ({ page }) => {
  await page.goto("/")

  await page.getByLabel("Název todo").fill("E2E todo 1")
  await page.getByText("Přidat todo").click()

  await expect(page.getByText("E2E todo 1")).toBeDefined()
})

test("form on detail page updates todo", async ({ page }) => {
  await page.goto("/")

  // create new entity
  await page.getByLabel("Název todo").fill("E2E todo 2")
  await page.getByText("Přidat todo").click()

  const link = await page.getByTestId("todos")
    .locator("li")
    .filter({ hasText: "E2E todo 2" })
    .getByTestId("todo-title")
    .getAttribute("href")

  await page.goto(link)

  // check detail title
  await expect(page.getByText("E2E todo 2")).toBeDefined()

  // fill in the form and submit it
  await page.getByLabel("Titulek").fill("Lmao")
  await page.getByLabel("Priorita").selectOption("low")
  await page.getByText("Uložit").click()

  await page.goto("/")

  const todo = await page.getByTestId("todos")
    .locator("li")
    .filter({ hasText: "E2E todo 2" })
    .nth(0)

  // check updated values
  await expect(todo.getByText("Lmao")).toBeDefined()
  await expect(todo.getByText("low")).toBeDefined()
})

test("button on index changes state when clicked", async ({ page }) => {
  await page.goto("/")

  // create new entity
  await page.getByLabel("Název todo").fill("E2E todo 3")
  await page.getByText("Přidat todo").click()

  const todo = await page.getByTestId("todos")
    .locator("li")
    .filter({ hasText: "E2E todo 3" })
    .nth(0)

  await expect(todo.getByText("nedokončeno")).toBeDefined()

  await todo
    .getByTestId("todo-state")
    .click()

  await expect(todo.getByText("dokončeno")).toBeDefined()
})

test("button on index deletes todo when clicked", async ({ page }) => {
  await page.goto("/")

  // create new entity
  await page.getByLabel("Název todo").fill("E2E todo 4")
  await page.getByText("Přidat todo").click()

  // change state
  await page.getByTestId("todos")
    .locator("li")
    .filter({ hasText: "E2E todo 4" })
    .getByTestId("todo-state")
    .click()

  // remove todo
  await page.getByTestId("todos")
    .locator("li")
    .filter({ hasText: "E2E todo 4" })
    .getByTestId("todo-remove")
    .click()

  const todo = page.getByTestId("todos")
    .locator("li")
    .filter({ hasText: "E2E todo 4" })

  await expect(todo).toHaveCount(0)
})

test("todo can be deleted from detail", async ({ page }) => {
  await page.goto("/")

  // create new entity
  await page.getByLabel("Název todo").fill("E2E todo 5")
  await page.getByText("Přidat todo").click()

  const link = await page.getByTestId("todos")
    .locator("li")
    .filter({ hasText: "E2E todo 5" })
    .getByTestId("todo-title")
    .getAttribute("href")

  await page.goto(link)

  // change state
  await page.getByTestId("todo")
    .getByTestId("todo-state")
    .click()

  // remove todo
  await page.getByTestId("todo")
    .getByTestId("todo-remove")
    .click()

  // check correct page
  await expect(page).toHaveURL("/")

  const todo = page.getByTestId("todos")
    .locator("li")
    .filter({ hasText: "E2E todo 5" })

  await expect(todo).toHaveCount(0)
})

test("default priority is normal", async ({ page }) => {
  await page.goto("/")

  // create entity
  await page.getByLabel("Název todo").fill("E2E todo 6")
  await page.getByText("Přidat todo").click()

  const priority = page.getByTestId("todos")
    .locator("li")
    .filter({ hasText: "E2E todo 6" })
    .getByTestId("todo-priority")

  await expect(priority).toContainText("normal")
})
