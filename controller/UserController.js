const User = require('../model/User');


class UserController {
    async show(req, res, next) {
        var user = await User.findOne();
        res.json(user);
    }

    async create(req, res, next) {
        var user = new User(req.body);
        await user.save()
            .then(
                () => res.send("successfully")
            )
            .catch(
                error => res.json(error)
            );
    }

    async login(req, res, next) {
        var username = req.body.username;
        var password = req.body.password;

        var user = await User.findOne({"username": username, "password": password});
        console.log(user)
        if (user) {
            var token = user.signJWT();
            res.json({
                username:user.username,
                fullname:user.fullname,
                userId:user._id,
                phone: user.phone,
                email: user.email,
                token: token
            })
        } else {
            res.send("Username or Password are not correct");
        }
    }

    async updatePassword(req, res, next) { 
        const username = req.body.username;
        const passwordUpdate = req.body.password;
        const user = await User.updateOne(
            {"username": username},
            {
                $set: {"password":passwordUpdate}
            }
        )
            .then(
                console.log("Update " + username + " success")
            )
            .catch(
                (error) => {
                    res.json({
                        error: "404"
                    })
                }
            );
        res.json(username + passwordUpdate + "update success");
    }

    async updateProfile(req, res, next) { 
        const username = req.body.username;
        const fullnameUpdate = req.body.fullname;
        const emailUpdate = req.body.email;
        const phoneUpdate = req.body.phone;
        const user = await User.updateOne(
            {"username": username},
            {
                $set: {"fullname":fullnameUpdate,
                        "email":emailUpdate,
                        "phone":phoneUpdate}
            }
        )
            .then(
                console.log( username + " success")
            )
            .catch(
                (error) => {
                    res.json({
                        error: "404"
                    })
                }
            );
        res.send("successfully");
    }

}

module.exports = new UserController();