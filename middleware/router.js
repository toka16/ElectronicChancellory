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
}