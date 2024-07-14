const UserModel = require('../models/user.model');
const bcrypt = require('bcrypt');
const httpErrors = require('http-errors');

class UserService {
    async createUser(user) {
        const userInDB = await UserModel.findOne({
            where: {
                email: user.email,
                isDeleted: false
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt', "isDeleted"]
            }
        });

        if (userInDB)
            throw httpErrors.Conflict(`User with email: ${user.email} already exist`);

        user.password = await bcrypt.hash(user.password, 10);

        const newUser = new UserModel(user);
        const savedUser = await newUser.save();
        return savedUser;
    }
}

module.exports = UserService;