const Post = require("../model/Post")
const Comment = require("../model/Post")

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
            .sort({createdAt: -1})
            .skip((page - 1) * limitPage)
            .limit(limitPage)
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

    async getOne(req, res, next) {
        const id = req.params.idPost;
        await Post.findOne({"_id": id})
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
                (post) => {
                    res.json(post)
                }
            )
            .catch(
                err => {
                    err
                }
            )
    }

    async addComment(req, res, next) {
        const newComment = req.body.commentPost;
        const id = req.params.idPost;
        await Post.findOne({"_id": id})
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
                (post) => {
                    if (post) {
                        post.comments.push({
                            detail: newComment.detail,
                            userComment: newComment.userComment
                        })
                        post.save()
                            .then(
                                post => {
                                    Post.findOne({"_id": id})
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
                                        .then(post => {
                                            res.json(post);
                                        })
                                        .catch(
                                            err => {
                                                res.json(err);
                                            }
                                        )

                                }
                            )
                            .catch(
                                err => {
                                    res.json(err);
                                }
                            )
                    } else
                        res.json("not found")

                }
            )
            .catch(
                (err) => res.json(err)
            )
    }

    async likePost(req, res, next) {
        const userId = "65f6aa46e21e50bbf7cf0e1c";

        const id = req.params.idPost;
        await Post.findOne({"_id": id})
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
                (post) => {
                    if (!post.likes.includes(userId)) {
                        post.likes = [...post.likes, userId];
                        post.save();
                    }
                    res.json(post);
                }
            )
            .catch(
                (err) => res.json(err)
            )
    }


    async unlikePost(req, res, next) {
        const userId = "65f6aa46e21e50bbf7cf0e1c";

        const id = req.params.idPost;
        await Post.findOne({"_id": id})
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
                (post) => {
                    if (post.likes.includes(userId)) {
                        const index = post.likes.indexOf(userId)
                        post.likes.splice(userId, 1)
                        post.save();
                    }
                    res.json(post);
                }
            )
            .catch(
                (err) => res.json(err)
            )
    }
}

module.exports = new PostController();