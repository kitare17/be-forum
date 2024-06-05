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
                path: 'topic'
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
            .populate({
                path: 'topic'
            })
            .populate({
                path: 'comments.replyComment',
                populate: {
                    path: 'userComment',
                    model: 'User',
                    select: 'username fullname',
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
            .populate({
                path: 'topic'
            })
            .populate({
                path: 'comments.replyComment',
                populate: {
                    path: 'userComment',
                    model: 'User',
                    select: 'username fullname',
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
                                        .populate({
                                            path: 'comments.replyComment',
                                            populate: {
                                                path: 'userComment',
                                                model: 'User',
                                                select: 'username fullname',
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
        const userId = req.body.userId;
        console.log("like id: ",req.body.userId)
        const id = req.params.idPost;
        await Post.findOne({"_id": id})
            .populate({
                path: 'creator',
                select: 'username fullname'

            })
            .populate({
                path: 'topic'
            })
            .populate({
                path: 'comments',
                populate: {
                    path: 'userComment',
                    model: 'User',
                    select: 'username fullname'
                }
            })
            .populate({
                path: 'comments.replyComment',
                populate: {
                    path: 'userComment',
                    model: 'User',
                    select: 'username fullname',
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
        const userId = req.body.userId;

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
            .populate({
                path: 'comments.replyComment',
                populate: {
                    path: 'userComment',
                    model: 'User',
                    select: 'username fullname',
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

    async relyComment(req, res, next) {
        const dataBody = req.body;

        const postId = dataBody.postId;

        const commentId = dataBody.commentId;

        const userComment = dataBody.userComment;
        const detail = dataBody.detail;


        await Post.findOne({"_id": postId})
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

            .then((post) => {
                if (post) {
                    // console.log(JSON.stringify(commentId)===(JSON.stringify(post.comments[0]._id)))
                    var index = post.comments.findIndex(
                        comment => JSON.stringify(commentId) === JSON.stringify(comment._id))
                    console.log("index", index)
                    if (index >= 0) {
                        post.comments[index].replyComment.push({
                            detail: detail,
                            userComment: userComment
                        })
                        post.save()
                            .then(updatePost => {
                                updatePost.populate({
                                    path: 'comments.replyComment',
                                    populate: {
                                        path: 'userComment',
                                        model: 'User',
                                        select: 'username fullname',
                                    }
                                }).then((resData) => {
                                    return res.json(resData)
                                })
                            })
                            .catch(err => {
                                return res.json({
                                    err: err
                                })
                            })

                    } else {
                        return res.status(500).json({
                            message: "Not found comment"
                        })
                    }

                } else {
                    return res.status(500).json({
                        message: "Not found post"
                    })
                }

            })
            .catch(err => {
                return res.status(500).json({
                    err: err,
                    message: "Error when find post"
                })
            })

    }

    async editDetail(req, res, next) {
        const dataBody = req.body;
        const postId = dataBody.postId;
        const detail = dataBody.detail;
        const title=dataBody.title;

        await Post.findOne({"_id": postId})
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

            .then((post) => {
                if(post){
                    post.detail=detail
                    post.title=title
                    post.save()

                    res.json({
                        post: post
                    })
                }

            })
            .catch(err => {
                return res.status(500).json({
                    err: err,
                    message: "Error when find post"
                })
            })

    }

    async removePost(req, res, next) {
        const postId=req.params.idPost;
        Post.remove({"_id": postId})
            .then((post)=>{
                res.status(200).json(
                    {
                        message:"Xóa bài viết thành công"
                    }
                )
            })
            .catch((err)=>{
                res.status(500).json(
                    {
                        err:err,
                        message:"Xóa bài viết không thành công"
                    }
                )
            })


    }
    async removeComment(req, res, next) {
        const dataBody = req.body;

        const postId = req.params.idPost;

        const commentId = req.params.commentId;

        console.log(postId +" "+commentId);


        await Post.findOne({"_id": postId})
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

            .then((post) => {
                if (post) {
                    // console.log(JSON.stringify(commentId)===(JSON.stringify(post.comments[0]._id)))
                    var index = post.comments.findIndex(
                        comment => JSON.stringify(commentId) === JSON.stringify(comment._id))
                    console.log("index", index)

                    if (index >= 0) {
                        post.comments.splice(index, 1);
                        post.save()
                            .then(updatePost => {
                                updatePost.populate({
                                    path: 'comments.replyComment',
                                    populate: {
                                        path: 'userComment',
                                        model: 'User',
                                        select: 'username fullname',
                                    }
                                }).then((resData) => {
                                    return res.json(resData)
                                })
                            })
                            .catch(err => {
                                return res.json({
                                    err: err
                                })
                            })

                    } else {
                        return res.status(500).json({
                            message: "Not found comment"
                        })
                    }

                } else {
                    return res.status(500).json({
                        message: "Not found post"
                    })
                }

            })
            .catch(err => {
                return res.status(500).json({
                    err: err,
                    message: "Error when find post"
                })
            })

    }

}

module.exports = new PostController();