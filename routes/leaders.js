const express = require('express');
const router=express.Router();
const leaderController= require("../controller/LeaderController");


//  [GET /leaders/:leadId]
router.get("/:leadId",leaderController.show);

//  [PUT /leaders/:leadId]
router.put("/:leadId",leaderController.update);

//  [POST /leaders]
router.post("/:leadId",leaderController.create);

router.delete("/:leadId",leaderController.remove);

module.exports = router;


