/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import {middleware} from "#start/kernel";

const AuthController = () => import('#controllers/auth_controller')
const ItemsController = () => import('#controllers/items_controller')
const ItemBidsController = () => import('#controllers/item_bids_controller')
const FilesController = () => import('#controllers/files_controller')

router
    .group(() => {
        router.post('/register', [AuthController, 'register']).as('register')
        router.post('/login', [AuthController, 'login']).as('login')
    })
    .prefix('auth')
    .as('auth')

router
    .group(() => {
        router
            .group(() => {
                router.post('/', [ItemsController, 'store']).as('store')
                router.get('/', [ItemsController, 'index']).as('index')
                router.get('/:id', [ItemsController, 'show']).as('show').where('id', {
                    match: /^[0-9]+$/,
                    cast: (value) => Number(value),
                })
                router.patch('/:id', [ItemsController, 'update']).as('update').where('id', {
                    match: /^[0-9]+$/,
                    cast: (value) => Number(value),
                })
                router.get('/active', [ItemsController, 'active']).as('active')
                router.post('/:id/bid', [ItemBidsController, 'store']).as('bid').where('id', {
                    match: /^[0-9]+$/,
                    cast: (value) => Number(value),
                })
            })
            .prefix('items')
            .as('items')
    })
    .use(middleware.auth({
        guards: ['api']
    }))

router
    .group(() => {
        router.get('/uploads/*', [FilesController, 'show']).as('show')
    })
    .prefix('files')
    .as('files')