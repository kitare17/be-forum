const Dish = require("../model/Dish")


class DisherController {

    //  [GET /dishes/:dishId]
    async show(req, res, next) {
        const id = req.params.dishId;
        const dish = await Dish.find({"_id": id})
            .then(
                console.log("ok")
            )
            .catch(
                (error) => {
                    res.json({
                        error: "404"
                    })
                }
            );
        res.json({dish: dish});
    }

    //  [PUT /dishes/:dishId]
    async update(req, res, next) {
        const id = req.params.dishId;
        const dishUpdate = req.body.dish;
        const dish = await Dish.updateOne(
            {"_id": id},
            {
                $set: {"name": dishUpdate.name}
            }
        )
            .then(
                console.log("Update dishes " + id + " success")
            )
            .catch(
                (error) => {
                    res.json({
                        error: "404"
                    })
                }
            );
        res.json(dish);
    }

    //  [POST /dishes/:dishId]
    async create(req, res, next) {
        const dishNew = new Dish(req.body.dish);
        await dishNew.save()
            .then(
                res.json({
                    message: "ok"
                })
            )
            .catch(
                (error) => {
                    res.json({
                        error: error
                    })
                }
            );
    }

    // [DELETE /dishes/:dishId]
    async remove(req, res, next) {
        const id = req.params.dishId;
        const dish = await Dish.deleteOne({"_id": id})
            .then(
                console.log("ok")
            )
            .catch(
                (error) => {
                    res.json({
                        error: "404"
                    })
                }
            );
        res.json(dish);
    }

    // [GET /dishes/:dishId/comment
    async showComment(req, res, next){
        Dish.findOne()
            .then(
                (dish)=>
                    res.json(dish.comments)
            )
            .catch(
                error=>
                    res.json(error)
            )
    }
    // [POST /dishes/:dishId/comment
    async createComment(req, res, next){
        var newComment=req.body.comment;
        console.log(newComment);
        Dish.findOne()
            .then(
                (dish)=>{
                    dish.comments.push(newComment);
                    dish.save();
                    res.json(newComment);
                }
            )
            .catch(
                error=>
                    res.json(error)
            )
    }
}


module.exports = new DisherController();