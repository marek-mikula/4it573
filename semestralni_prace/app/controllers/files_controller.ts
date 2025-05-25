import { sep, normalize } from 'node:path'
import type {HttpContext} from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class FilesController {

    async show({request, response}: HttpContext) {
        const PATH_TRAVERSAL_REGEX = /(?:^|[\\/])\.\.(?:[\\/]|$)/

        const filePath = request.param('*').join(sep)
        const normalizedPath = normalize(filePath)

        if (PATH_TRAVERSAL_REGEX.test(normalizedPath)) {
            return response.status(400).json({message: 'Malformed file path.'})
        }

        const absolutePath = app.makePath('uploads', normalizedPath)

        return response.download(absolutePath)
    }

}