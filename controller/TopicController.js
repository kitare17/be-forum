const Topic = require("../model/Topic");
const Post = require("../model/Post");

class TopicController {

    async showTopic(req, res, next) {
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


    async showTopicDetail(req, res, next) {
        const slug = req.params.slug;
        var page = req.query.page || 1;
        var limitPage = 6;



        const topic = await Topic.findOne({"slug": slug})
        const topicId = topic._id.toString();
        console.log(topicId)

        const totalPosts = await Post.find({"topic": topicId}).countDocuments();



        await Post.find({"topic": topicId})
            .sort({createdAt: -1})
            .skip((page - 1) * limitPage)
            .limit(limitPage)
            .populate({
                path: 'topic'
            })
            .populate({
                path: 'creator',
                select: 'username fullname'

            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'userComment',
                    model: 'User',
                    select: 'username fullname'
                }
            })
            .then(
                (posts) => {
                    res.json({
                        posts: posts,
                        maxPage:Math.ceil(totalPosts / limitPage)
                    })
                }
            )
            .catch(
                (err) => res.json(err)
            )

    }
}

module.exports = new TopicController();