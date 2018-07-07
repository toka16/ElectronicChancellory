import Vuex from 'vuex'

const createStore = () => {
    return new Vuex.Store({
        state: {
            title: "",
            notifications: [],
            operators: []
        },
        mutations: {
            setTitle(state, title) {
                state.title = title
            },
            setNotifications(state, notifications) {
                state.notifications = notifications
            },
            setNotificationStatus(state, i, status) {
                state.notifications[i] ? state.notifications[i].status = status : null
            },
            setOperators(state, operators){
                state.operators = operators
            }
        }
    })
}

export default createStore