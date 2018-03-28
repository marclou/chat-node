class Users {
    constructor() {
        this.users = [];
    }

    addUser(id, name, room) {
        let user = {id, name, room};

        this.users.push(user);

        return user;
    }

    removeUser(id) {
        let userToRemove = this.getUser(id);

        if (userToRemove) {
            this.users = this.users.filter(user => user.id !== userToRemove.id);
        }
        
        return userToRemove;
    }

    getUser(id) {
        return this.users.find(user => user.id === id);
    }

    getUserList(room) {
        let userInRoom = this.users.filter(user => user.room === room);

        return userInRoom.map(user => user.name);
    }


}

module.exports = {
    Users
}
