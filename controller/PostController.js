const Post = require("../model/Post")

class PostController {


    async createPost(req, res, next) {
        const postDataBody = req.body;
        const newPost = new Post(postDataBody);
        await newPost.save()
            .then(
                (post) => {
                    res.json(post);
                }
            )
            .catch(
                (err) => res.json(err)
            )
    }

    async showPost(req, res, next) {
        var page = req.query.page || 1;
        var limitPage = 6;
        var totalPosts = await Post.countDocuments();
        var maxPage = Math.ceil(totalPosts / limitPage);
        await Post
            .find()
            .skip((page - 1) * limitPage)
            .limit(limitPage)
            .populate('creator')
            .populate({
                path: 'comments',
                populate: {
                    path: 'userComment',
                    model: 'User'
                }
            })
            .then(
                (posts) => {
                    res.json({
                            posts: posts,
                            maxPage: maxPage
                        }
                    )
                }
            )
            .catch(
                (err) => {
                    res.json(err)
                }
            )
    }
}

module.exports = new PostController();