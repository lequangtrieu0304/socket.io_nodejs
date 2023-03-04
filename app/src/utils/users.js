let userList = [];

const addUser = (newUser) => {
    userList = [...userList, newUser];
}

const getUserList = (room) => userList = userList.filter(user => user.room === room);

const removeUser = (id) => userList = userList.filter(user => user.id !== id);

module.exports = {
    getUserList,
    addUser,
    removeUser
}