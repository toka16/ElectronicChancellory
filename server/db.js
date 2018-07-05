import mysql from 'mysql'

const pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'chancellory_user',
    password: 'chancellorypassword',
    database: 'el_chancellory',
    port: 3306,
    multipleStatements: true
});

export const getConnection = () => {
    return new Promise((resolve, reject) => { // eslint-disable-line
        pool.getConnection((err, conn) => {
            if (err) {
                return reject(err);
            }
            resolve(conn);
        });
    })
}

export const login = async (data) => {
    const result = await query('SELECT * FROM Users WHERE email = ?', data.email);
    if (!result || result.length === 0) {
        throw new Error("Invalid email or password");
    }
    return result[0];
}

export const saveDoc = (doc) => {
    return insert('Docs', doc);
}

export const getDoc = async (id) => {
    const results = await query('SELECT * from docs_view where id = ?', id);
    if (results && results.length > 0) {
        return results[0];
    }
    throw new Error("Document not found");
}

export const getAllDocs = () => {
    return query("SELECT * from docs_view");
}

export const getUserDocs = (id) => {
    return query("SELECT * from docs_view where author_id = ?", id);
}

export const getUnsignedDocs = ()=>{
    return query("SELECT * from docs_view where signature IS NULL");
}

export const getUserSignedDocs = (id)=>{
    return query("SELECT * from docs_view where signer_id = ?", id);
}

export const signDoc = (signature) => {
    return insert('Signatures', signature);
}

export const saveKey = (key) => {
    return insert('RSA_Keys', key);
}

export const findKeys = (params) => {
    return query(`SELECT * from RSA_Keys where owner_id = ? and created_at < ?`, [params.owner_id, new Date(params.created_at)]);
}

export const getComments = (docId) => {
    return query(`SELECT * from comments_view where document_id = ?`, docId);
}

export const saveComment = (comment) => {
    return insert('Comments', comment);
}

export const getUsers = ()=>{
    return query('SELECT * from Users');
}

export const getUser = async (id) => {
    const results = await query('SELECT * from Users where id=?', id);
    if (results && results.length > 0) {
        return results[0];
    }
    throw new Error("User not found");
}

export const saveUser = (user)=>{
    return insert('Users', user);
}

export const updateUser = (user)=>{
    return query(`UPDATE Users SET first_name=?,last_name=?,email=?,password=? WHERE id=?`, [user.first_name, user.last_name, user.email,user.password, user.id])
}

export const saveNotification = (notification)=>{
    return insert("Notifications", notification)
}

export const getNotifications = (id)=>{
    return query("SELECT * from Notifications where target_id=?", id)
}

export const setNotificationSeen = (notificationId, userId)=>{
    return query("UPDATE Notifications SET status=1 where id=? and target_id=?", [notificationId, userId])
}

function insert(table, item) {
    return query(`INSERT INTO ${table} SET ?`, item)
}

function query(...query) {
    return new Promise((resolve, reject) => { // eslint-disable-line
        getConnection().then(conn => {
            console.log(query);
            conn.query(...query, (error, results) => {
                if (error) return reject(error);
                resolve(results);
                conn.release();
            });
        }).catch(reject)
    })
}