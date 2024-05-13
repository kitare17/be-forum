const Topic = require("../model/Topic");

class TopicController {

    async showPost(req, res, next) {
        await Topic.find()
            .then((topics) => {
                res.json({
                    topics: topics
                })
            })
            .catch(
                (err) => {
                    res.json(err)
                }
            )
    }

    async createTopic(req, res, next) {
        const topicDataBody = req.body;
        const newTopic = new Topic(topicDataBody);
        await newTopic.save()
            .then(
                (topic) => {
                    res.json(topic);
                }
            )
            .catch(
                (err) => res.json(err)
            )
    }

}

module.exports = new TopicController();