import * as types from './mutation-types'

export const clickNext = ({commit}) => {
    commit(types.CLICK_NEXT)
}

export const clickPrev = ({commit}) => {
    commit(types.CLICK_PREV)
}

export const clickPage = ({commit}, page) => {
    commit(types.CLICK_PAGE, {
        page: page
    })
}