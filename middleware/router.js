export default (ctx)=>{
    const titles = {
        index: 'Welcome',
        documents: 'Documents',
        'new-document': 'New Document',
        'documents-id': 'Document',
        profile: 'Profile',
        users: 'Users',
        register: 'Register'
    }

    console.log(ctx.route)
    const title = titles[ctx.route.name] || 'Electronic Chancellory'
    ctx.store.commit('setTitle', title);
}