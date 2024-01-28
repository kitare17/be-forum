const jwt = require("jsonwebtoken");
const User=require("../../model/User");

function authentication(req, res, next) {
    var token = req.body.token;
    jwt.verify(token, "kitarenfaklhek", (err, user) => {
        if (err) res.send("loi");
        else {
            res.send("dc roi nhe")
        }
    });
}
  function verifyAdmin(req, res, next){
     var token = req.body.token;
     jwt.verify(token, "kitarenfaklhek", (err, user) => {
         if (err) res.json(err);
         else {
             var username=user.username;
             console.log(username);
             var checkUser;
             User.findOne({"username":username}).then(
                 user=>{
                     checkUser=user;
                     console.log(checkUser);
                     if(!checkUser) res.send("User not exist");
                     if(!checkUser.admin) res.send("User isn't admin");
                     else
                         next();
                 }
             );

         }
     });

}

module.exports = {authentication, verifyAdmin};