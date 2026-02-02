// server/users.js

class Users {
  constructor() {
    this.users = new Map();
  }

  add(socketId, user) {
    this.users.set(socketId, user);
  }

  remove(socketId) {
    const user = this.users.get(socketId);
    this.users.delete(socketId);
    return user;
  }

  list() {
    return Array.from(this.users.values());
  }
}

module.exports = Users;
