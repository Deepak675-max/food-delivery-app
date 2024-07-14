const UserService = require('../services/user.service');

class UserContoller {
    constructor() {
        this.userService = new UserService();
        console.log("object created!!");
    }
    createUser = async (req, res, next) => {
        try {
            const user = req.body;
            const savedUser = await this.userService.createUser(user);
            res.status(201).send(savedUser);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = UserContoller;