const SalePost = require("../model/SalePost")
const Comment = require("../model/SalePost")
//tạo post , thêm comment
class SalePostController {

    async createPost(req, res, next) { //done
        const salePostDataBody = req.body;
        const newPost = new SalePost(salePostDataBody);
        await newPost.save()
            .then(
                (savedPost) => {
                    res.json(savedPost);
                }
            )
            .catch(
                (err) => res.json(err)
            )
    }
    async updateSalePost(req, res, next) { //sửa
        const id = req.params.idSalePost;
        var bodyData = req.body;
        await SalePost.findOne({"_id": id})
            .then(
                (updateSalePost) => {
                    updateSalePost.title = bodyData.title;
                    updateSalePost.detail = bodyData.detail;
                    updateSalePost.images = bodyData.images;
                    updateSalePost.productStatus  = bodyData.productStatus;
                    updateSalePost.brand  = bodyData.brand;
                    updateSalePost.origin = bodyData.origin;
                    updateSalePost.address = bodyData.address;
                    updateSalePost.category = bodyData.category;
                    updateSalePost.isLock = bodyData.isLock;
                    updateSalePost.isSold = bodyData.isSold;
                    updateSalePost.save()
                        .then(
                            (updateSalePost) => {
                                res.json(updateSalePost);
                            }
                        )
                        .catch(
                            (err) => {
                                res.json(err);
                            }
                        )
                }
            )
            .catch(
                (error) => {
                    res.json({
                        error: error
                    })
                }
            );

    }

    async showSalePost(req, res, next) { //done
        var page = req.query.page || 1;
        var limitPage = 8;
        var totalPosts = await SalePost.countDocuments();
        var maxPage = Math.ceil(totalPosts / limitPage);
        await SalePost
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
                (salePosts) => {
                    res.json({
                        salePosts: salePosts,
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
    async getOne(req, res, next){ //done
        const id=req.params.idSalePost;
        await SalePost.findOne({"_id":id})
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
                (salePost)=>{
                    res.json(salePost)
                }
            )
            .catch(
                err=>{
                    err
                }
            )
    }
    async getBaseOnCategory(req, res, next){ //done  //chua bo vo router
        const cateid=req.params.idcategory;
        await SalePost.find({"category":cateid})
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
                (salePost)=>{
                    res.json(salePost)
                }
            )
            .catch(
                err=>{
                    err
                }
            )
    }

    async addComment(req, res, next) { //done
        const newComment = req.body;
        const id = req.params.idSalePost;
        await SalePost.findOne({"_id": id})
            .then(
                (salePost) => {
                    if (salePost) {
                        salePost.comments.push({
                            detail: newComment.detail,
                            userComment: newComment.userComment
                        })
                        salePost.save()
                            .then(
                                salePost => {
                                    res.json(salePost);
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


    async deleteSalePost(req, res, next) { //xóa
        const id = req.params.idSalePost;
        await SalePost.deleteOne({"_id": id})
            .then(
                (salePost) => {
                    res.json(salePost);
                }
            )
            .catch(
                (error) => {
                    res.json({
                        error: error
                    })
                }
            );

    }

    
}

module.exports = new SalePostController();