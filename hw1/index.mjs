import {readFile, writeFile} from "fs"

readFile('instructions.txt', (err, content) => {
    if (err) {
        if (err.code === 'ENOENT') {
            console.error('File instructions.txt does not exist.')
        } else {
            console.error('Error while reading instructions.txt.')
        }

        return
    }

    // take ony first row in the file
    const paths = content.toString().split('\n')[0]

    // validate input/output paths
    if (!/^[^ ]+ [^ ]+$/.test(paths)) {
        console.error('The paths in the instructions.txt file must be two file paths divided by single space.')

        return
    }

    // break the line by space and retrieve
    // file paths
    const [inputFile, outputFile] = paths.split(' ')

    // read the input file and copy the contents
    // to the output file
    readFile(inputFile, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                console.error(`File ${inputFile} does not exist.`)
            } else {
                console.error(`Error while reading ${inputFile}.`)
            }

            return
        }

        writeFile(outputFile, content, (err) => {
            if (err) {
                console.error(`Error while writing ${outputFile}.`)
            } else {
                console.error(`Successfully copied contents from ${inputFile} to ${outputFile}.`)
            }
        })
    })
})
