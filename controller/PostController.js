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
        await Post.find().populate('creator').populate({
            path: 'comments',
            populate: {
                path: 'userComment',
                model: 'User'
            }
        })
            .then(
                (posts) => {
                    res.json(posts)
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