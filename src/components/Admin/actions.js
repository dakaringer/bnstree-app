import * as actionType from './actionTypes'
import apollo, {q} from '../../apollo'

import {makeActionCreator} from '../../helpers'

import {message} from 'antd'

export const setView = makeActionCreator(actionType.SET_ADMIN_VIEW, 'view')

const flushCacheMutation = q`mutation {
    Admin {
        flushCache
    }
}`

export function flushCache() {
    apollo
        .mutate({
            mutation: flushCacheMutation
        })
        .then(json => {
            message.success('Cache flushed')
        })
        .catch(e => {
            message.error('Error')
            console.error(e)
        })
}
