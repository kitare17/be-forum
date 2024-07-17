const User = require('../model/User');
const bcrypt = require('bcrypt');

class UserController {
    async show(req, res, next) {
        var user = await User.findOne();
        res.json(user);
    }

    async create(req, res, next) {
        const {email, password, username} = req.body;
        try {
            const existedUserEmail = await User.findOne({
                email: email,
            });
            if (existedUserEmail !== null) {
                return res.status(409).json({
                    message: "The email of user is existed",
                    data: null,
                    statusMessage: "Error",
                });
            }

            const existedUserUsername = await User.findOne({
                username: username,
            });
            if (existedUserUsername !== null) {
                return res.status(409).json({
                    message: "The username of user is existed",
                    data: null,
                    statusMessage: "Error",
                });
            }

            const hash = bcrypt.hashSync(password, 10);
            // console.log("hash", hash)
            console.log(email + " " + password + " " + username)
            const createdUser = await User.create({
                    email,
                    password: hash,
                    username,
                    phone: undefined
                })
            ;

            if (createdUser) {
                return res.json({
                    status: 200,
                    message: "Register user success",
                    typeError: "",
                    data: createdUser,
                    statusMessage: "Success",
                });
            }

        } catch (e) {
            return e
        }
    }

    async login(req, res, next) {
        var email = req.body.email;
        var password = req.body.password;

        var userEmail = await User.findOne({"email": email});

        if (userEmail) {
            const comparePassword = bcrypt.compareSync(password, userEmail.password);
           
            console.log(comparePassword);
            if (comparePassword) {
                var token = userEmail.signJWT();
                return res.json({
                    username: userEmail?.userEmailname,
                    fullname: userEmail?.fullname,
                    userEmailId: userEmail._id,
                    phone: userEmail?.phone,
                    email: userEmail.email,
                    admin: userEmail?.admin,
                    token: token
                })
            } else {
                res.status(401).json({
                    status: "Error",
                    message: "Username or Password are not correct"
                });
            }

        } else {
            res.status(401).json({
                status: "Error",
                message: "Username or Password are not correct"
            });
        }
    }

    async updatePassword(req, res, next) {
        const username = req.body.username;
        const passwordUpdate = req.body.password;
        const oldPassword = req.body.oldPassword;
        const confirmPass = req.body.confirmPassword
        var userx = await User.findOne({"username": username, "password": oldPassword});
        if (userx && confirmPass == passwordUpdate) {
            const user = await User.updateOne(
                {"username": username},
                {
                    $set: {"password": passwordUpdate}
                }
            )
                .then(
                    console.log("Update " + username + " success")
                )
                .catch(
                    (error) => {
                        res.json({
                            error: "401"
                        })
                    }
                );
            res.json("update success");
        } else {
            res.status(401);
            res.json("fail")
        }

    }

    async updateProfile(req, res, next) {
        const username = req.body.username;
        const fullnameUpdate = req.body.fullname;
        const emailUpdate = req.body.email;
        const phoneUpdate = req.body.phone;
        const user = await User.updateOne(
            {"username": username},
            {
                $set: {
                    "fullname": fullnameUpdate,
                    "email": emailUpdate,
                    "phone": phoneUpdate
                }
            }
        )
            .then(
                console.log(username + " success")
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