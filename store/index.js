import Vuex from 'vuex'

const createStore = () => {
    return new Vuex.Store({
        state: {
            title: "",
            notifications: []
        },
        mutations: {
            setTitle(state, title) {
                state.title = title
            },
            setNotifications(state, notifications) {
                state.notifications = notifications
            }
        },
        actions: {
            async nuxtServerInit({
                commit
            }, {
                $axios
            }) {
                try {
                    const notifications = await $axios.$get("/api/notifications");
                    notifications.sort((a, b) => {
                        const aTime = new Date(a.created_at).getTime()
                        const bTime = new Date(b.created_at).getTime()
                        return bTime - aTime;
                    });
                    console.log(notifications)
                    commit('setNotifications', notifications)
                } catch (e) {
                    console.log(e)
                }

            }
        }
    })
}

export default createStore