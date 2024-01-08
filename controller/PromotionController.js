const Promotion = require("../model/Promotion");

class PromotionController {

    //  [GET /promotions/:promoId]
    async show(req, res, next) {
        const id = req.params.promoId;
        const dish = await Promotion.find({"_id": id})
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

    //  [PUT /promotions/:promoId]
    async update(req, res, next) {
        const id = req.params.promoId;
        const promotionUpdate = req.body.promotion;
        const promotion = await Promotion.updateOne(
            {"_id": id},
            {
                $set: {"name": promotionUpdate.name}
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
        res.json(promotion);
    }

    //  [POST /promotions/:promoId]
    async create(req, res, next) {
        const promotionNew = new Promotion(req.body.promotion);
        await promotionNew.save()
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

    // [DELETE /promotions/:promoId]
    async remove(req, res, next) {
        const id = req.params.promoId;
        const dish = await Promotion.deleteOne({"_id": id})
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
}

module.exports = new PromotionController();