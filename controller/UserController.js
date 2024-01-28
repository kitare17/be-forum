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
   async login(req,res,next){
        var user=new User(req.body);
       var token= user.signJWT();
        res.json({
            token:token
        })
   }
   async check(req,res,next){

   }
}

module.exports = new UserController();