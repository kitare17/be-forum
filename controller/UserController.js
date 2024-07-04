const User = require('../model/User');
const bcrypt = require('bcrypt');

class UserController {
    async show(req, res, next) {
        var user = await User.findOne();
        res.json(user);
    }

    async create(req, res, next) {
        const { email, password, username, fullname, phone, avatar } = req.body;
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
                fullname,
                phone, avatar
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
        try {
            var email = req.body.email;
            var password = req.body.password;
            var userEmail = await User.findOne({ "email": email });
            var checkUsername = await User.findOne({ "username": email });

            if (userEmail != null || checkUsername != null) {
                if (userEmail) {
                    const comparePassword = bcrypt.compareSync(password, userEmail.password);
                    if (comparePassword) {
                        var token = userEmail.signJWT();
                        return res.json({
                            username: userEmail.username,
                            fullname: userEmail.fullname,
                            userEmailId: userEmail._id,
                            phone: userEmail.phone,
                            email: userEmail.email,
                            admin: userEmail.admin,
                            token: token
                        });
                    } else {
                        res.status(401).json({
                            status: "Error",
                            message: "Username or Password are not correct"
                        });
                    }
                } else if (checkUsername) {
                    const comparePassword = bcrypt.compareSync(password, checkUsername.password);
                    if (comparePassword) {
                        var token = checkUsername.signJWT();
                        return res.json({
                            username: checkUsername.username,
                            fullname: checkUsername.fullname,
                            userEmailId: checkUsername._id,
                            phone: checkUsername.phone,
                            email: checkUsername.email,
                            admin: checkUsername.admin,
                            token: token
                        });
                    } else {
                        res.status(401).json({
                            status: "Error",
                            message: "Username or Password are not correct"
                        });
                    }
                }
            } else {
                res.status(401).json({
                    status: "Error",
                    message: "Username or Password are not correct"
                });
            }
        } catch (error) {
            next(error);
        }
    }


    async updatePassword(req, res, next) {
        const username = req.body.username;
        const passwordUpdate = req.body.password;
        const oldPassword = req.body.oldPassword;
        const confirmPass = req.body.confirmPassword
        var userx = await User.findOne({ "username": username, "password": oldPassword });
        if (userx && confirmPass == passwordUpdate) {
            const user = await User.updateOne(
                { "username": username },
                {
                    $set: { "password": passwordUpdate }
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

    async getDetailUser(req, res, next) {
        const userId = req.params.userId;
        const userDetail = await User.findOne({ "_id": userId });

        if (!userDetail) {

            res.status(401).json({
                status: "Error",
                message: "User isn't found"
            });
        }

        else {
            res.status(200).json({
                user: userDetail
            });
        }
    }

    async updateProfile(req, res, next) {
        const userId = req.params.userId;
        const username = req.body.username;
        const fullname = req.body.fullname;
        const avatar = req.body.avatar;
        const email = req.body.email;
        const phone = req.body.phone;
        console.log("sdfsdfsdfsdfsfd",avatar  )
        await User.findOne({ "_id": userId })
            .then(async (userDetail) => {
                if (userDetail) {
                    const existEmail = await User.findOne({ "email": email })
                    const existUsername = await User.findOne({ "username": username })
                    if (existEmail && existEmail._id.toString() !== userId) {
                        res.status(409).json({ status: "Error", message: "Email was exist" });
                    }
                    else if (existUsername && existUsername.id.toString() !== userId) {
                        res.status(409).json({ status: "Error", message: "Username was exist" });
                    }
                    else {
                        const userProfile = {
                            username: username || userDetail.username,
                            email: email || userDetail.email,
                            password: userDetail.password,
                            admin: userDetail.admin,
                            fullname: fullname || userDetail.fullname,
                            phone: phone || userDetail.phone,
                            avatar: avatar || userDetail.avatar
                        }
                        await User.updateOne(
                            { _id: userId },
                            { $set: userProfile }
                        )
                        res.status(200).json({
                            user: userProfile,
                            status: "Success",
                            message: "Update success"
                        }
                        )
                    }



                } else {
                    res.status(404).json({ status: "Error", message: "USer is not found" });
                }
            })
    }



}

module.exports = new UserController();