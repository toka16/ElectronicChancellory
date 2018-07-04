import Vuex from 'vuex'

const createStore = () => {
    return new Vuex.Store({
        state: {
            title: ""
        },
        mutations: {
            setTitle(state, title) {
                state.title = title
            }
        }
    })
}

export default createStore