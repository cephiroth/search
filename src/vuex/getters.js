export const getCurrent = state => {
    return state.pagination.currentPage;
}

export const getTotal = state => {
    return state.pagination.totalPage;
}

export const getFirst = state => {
    return state.pagination.isFirst;
}

export const getLast = state => {
    return state.pagination.isLast;
}