export default (ctx)=>{
    const titles = {
        index: 'Welcome',
        documents: 'Documents',
        'new-document': 'New Document',
        'documents-id': 'Document',
        'users-id': 'User Profile',
        profile: 'Profile',
        users: 'Users',
        register: 'Register'
    }

    const title = titles[ctx.route.name] || 'Electronic Chancellory'
    ctx.store.commit('setTitle', title);

    for (let i=0; i<ctx.store.state.notifications.length; i++){
        if (ctx.store.state.notifications[i].link === ctx.route.fullPath){
            ctx.$axios.put(`/api/notifications/${ctx.store.state.notifications[i].id}/seen`).then(() => {
                ctx.store.commit('setNotificationStatus', i, 1)
            })
        }
    }
}