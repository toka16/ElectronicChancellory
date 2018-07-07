export default (ctx) => {

    function refreshNotifications() {
        ctx.$axios.$get("/api/notifications").then(notifications => {
            notifications.sort((a, b) => {
                const aTime = new Date(a.created_at).getTime()
                const bTime = new Date(b.created_at).getTime()
                return bTime - aTime;
            });
            ctx.store.commit('setNotifications', notifications)
        })
    }

    if (process.client) {
        setTimeout(refreshNotifications, 100)
        setInterval(refreshNotifications, 5000)
    } else {
        console.log("is on server")
    }
}