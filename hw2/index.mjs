import {readFile, writeFile} from "fs"

function promisableCreateFile(n) {
    return new Promise((resolve, reject) => {
        writeFile(`${n}.txt`, `Soubor ${n}`, (err) => {
            if (err) {
                reject(err)
            } else {
                resolve()
            }
        })
    })
}

readFile('instructions.txt', async (err, content) => {
    if (err) {
        if (err.code === 'ENOENT') {
            console.error('File instructions.txt does not exist.')
        } else {
            console.error('Error while reading instructions.txt.')
        }

        return
    }

    // take ony first row in the file
    const row = content.toString().split('\n')[0]

    // validate input/output paths
    if (!/^[0-9]+$/.test(row)) {
        console.error('The contents of the instructions.txt file must be a single number.')

        return
    }

    const n = parseInt(row)

    const promises = []

    for (let i = 1; i <= n; i++) {
        promises.push(promisableCreateFile(i))
    }

    await Promise.all(promises)

    console.log(`Files (${n}) created.`)
})
