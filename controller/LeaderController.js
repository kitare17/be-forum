const Leader=require("../model/Leader");
class LeaderController{

    //  [GET /leaders/:leadId]
    async show(req, res, next) {
        const id = req.params.leadId;
        const leader = await Leader.find({"_id": id})
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
        res.json({leader: leader});
    }

    //  [PUT /leaders/:leadId]
    async update(req, res, next) {
        const id = req.params.leadId;
        const leaderUpdate = req.body.leader;
        const leader = await Leader.updateOne(
            {"_id": id},
            {
                $set: {"name": leaderUpdate.name}
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
        res.json(leader);
    }

    //  [POST /leaders/:leadId]
    async create(req, res, next) {
        const leaderNew = new Leader(req.body.leader);
        await leaderNew.save()
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

    // [DELETE /leaders/:leadId]
    async remove(req, res, next) {
        const id = req.params.leadId;
        const leader = await Leader.deleteOne({"_id": id})
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
        res.json(leader);
    }
}

module.exports = new LeaderController();