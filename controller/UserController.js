const User = require('../model/User');
const bcrypt = require('bcrypt');

class UserController {
    async show(req, res, next) {
        var user = await User.findOne();
        res.json(user);
    }

    async create(req, res, next) {
        const { email, password, username, fullname, phone, avatar, status } = req.body;
        try {
            // Check if email already exists
            const existedUserEmail = await User.findOne({ email });
            if (existedUserEmail) {
                return res.status(409).json({
                    message: "The email of user already exists",
                    data: null,
                    statusMessage: "Error",
                });
            }
    
            // Check if username already exists
            const existedUserUsername = await User.findOne({ username });
            if (existedUserUsername) {
                return res.status(409).json({
                    message: "The username of user already exists",
                    data: null,
                    statusMessage: "Error",
                });
            }
    
            // Hash the password
            const hash = bcrypt.hashSync(password, 10);
            // console.log(email, password, username, fullname, phone, avatar, status);
    
            // Create the user
            const createdUser = await User.create({
                email,
                password: hash,
                username,
                fullname,
                phone,
                avatar,
                status,
            });
    
            // Send success response
            return res.status(201).json({
                status: 200,
                message: "Register user success",
                errorType: "",
                data: createdUser,
                statusMessage: "Success",
            });
        } catch (e) {
            // Send error response
            return res.status(500).json({
                message: "Internal server error",
                error: e.message,
                statusMessage: "Error",
            });
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
        await User.findOne({ "_id": userId })
            .then(async (userDetail) => {
                if (userDetail) {
                    const existEmail = await User.findOne({ "email": email })
                    const existUsername = await User.findOne({ "username": username })
                    const existPhone = await User.findOne({ "phone": phone })
                    if (existEmail && existEmail._id.toString() !== userId) {
                        res.status(409).json({ status: "Error", message: "Email was exist" });
                    }
                    else if (existUsername && existUsername.id.toString() !== userId) {
                        res.status(409).json({ status: "Error", message: "Username was exist" });
                    }
                    else if (phone !== "" && existPhone && existPhone.id.toString() !== userId) {
                        res.status(409).json({ status: "Error", message: "Phone was exist" });
                    }
                    else {
                        const userProfile = {
                            username: username || userDetail.username,
                            email: email || userDetail.email,
                            password: userDetail.password,
                            admin: userDetail.admin,
                            fullname: fullname || userDetail.fullname,
                            phone: phone || userDetail.phone,
                            avatar: avatar || userDetail.avatar,
                            status: userDetail.status
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