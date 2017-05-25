import * as types from '../mutation-types'

const state = {
    currentPage: 1,
    totalPage: 17,
    isFirst: true,
    isLast: false
}

const actions = {
    clickNext ({commit}) {
        commit(types.CLICK_NEXT)
    },
    clickPrev ({commit}) {
        commit(types.CLICK_PREV)
    },
    clickPage ({commit}, page) {
        commit(types.CLICK_PAGE, {
            page: page
        })
    }
}

const getters = {
    getCurrent: state => state.currentPage,
    getTotal: state => state.totalPage,
    getFirst: state => state.isFirst,
    getLast: state => state.isLast
}

const mutations = {
    [types.CLICK_NEXT] (state) {
        state.currentPage = state.currentPage === state.totalPage ? state.currentPage : state.currentPage + 1;
        state.isFirst = state.currentPage === 1 ? true : false;
        state.isLast = state.currentPage === state.totalPage ? true : false;
    },
    [types.CLICK_PREV] (state) {
        state.currentPage = state.currentPage === 1 ? state.currentPage : state.currentPage - 1;
        state.isFirst = state.currentPage === 1 ? true : false;
        state.isLast = state.currentPage === state.totalPage ? true : false;
    },
    [types.CLICK_PAGE] (state, payload) {
        if (state.currentPage !== payload.page) {
            state.currentPage = payload.page;
            state.isFirst = state.currentPage === 1 ? true : false;
            state.isLast = state.currentPage === state.totalPage ? true : false;
        }
    },
}


export default {
    actions,
    getters,
    state,
    mutations
}