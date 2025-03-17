import {readFile, writeFile} from 'fs/promises'
import http from 'http'

const path = 'counter.txt'

async function readCounter() {
    try {
        const data = await readFile(path, 'utf8')
        return parseInt(data, 10)
    } catch (error) {
        // file does not exist => create it and return 0
        if (error.code === 'ENOENT') {
            await writeFile(path, '0')
            return 0
        }

        throw error
    }
}

async function updateCounter(change) {
    const currentValue = await readCounter()
    const newValue = currentValue + change
    await writeFile(path, newValue.toString())
    return newValue
}

const server = http.createServer(async (req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'})

    if (req.url === '/increase') {
        const newValue = await updateCounter(1)
        res.end(`Value updated to ${newValue}`)
    } else if (req.url === '/decrease') {
        const newValue = await updateCounter(-1)
        res.end(`Value updated to ${newValue}`)
    } else if (req.url === '/read') {
        const value = await readCounter()
        res.end(value.toString())
    } else {
        res.end('Not Found')
    }
})

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/')
})
