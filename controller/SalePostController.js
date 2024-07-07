const SalePost = require("../model/SalePost")
const Comment = require("../model/SalePost")
const Category = require("../model/Category")
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
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
            // .populate({
            //     path: 'comments',
            //     populate: {
            //         path: 'userComment',
            //         model: 'User',
            //         select: 'username fullname'
            //     }
            // })
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
            // .populate({
            //     path: 'comments',
            //     populate: {
            //         path: 'userComment',
            //         model: 'User',
            //         select: 'username fullname'
            //     }
            // })
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
    // async getBaseOnCategory(req, res, next){ 
    //     const slugId= req.params.idslug
    //     const jsonString = ''
    //     await Category.find({"slug": slugId},'_id')
    //         .then(
    //             (category) => {
    //                  jsonString = JSON.stringify(category)
                    
    //             }
    //         )
    //         .catch(
    //             (error) => {
    //                 res.json({
    //                     error: error
    //                 })
    //             }
    //         );
    //     var page = req.query.page || 1;
    //     var limitPage = 8;
    //     var totalPosts = await SalePost.countDocuments();
    //     var maxPage = Math.ceil(totalPosts / limitPage);
    //     await SalePost
    //         .find({"category":jsonString._id})
    //         .sort({createdAt: -1})
    //         .skip((page - 1) * limitPage)
    //         .limit(limitPage)
    //         .populate({
    //             path: 'creator',
    //             select: 'username fullname'

    //         })
    //         .populate({
    //             path: 'comments',
    //             populate: {
    //                 path: 'userComment',
    //                 model: 'User',
    //                 select: 'username fullname'
    //             }
    //         })
    //         .then(
    //             (salePosts) => {
    //                 res.json({
    //                     salePosts: salePosts,
    //                         maxPage: maxPage
    //                     }
    //                 )
    //             }
    //         )
    //         .catch(
    //             (err) => {
    //                 res.json(err)
    //             }
    //         )
    // }

    async getBaseOnCategory(req, res, next) {
        const slugId = req.params.idslug;
    
        try {
            const category = await Category.findOne({ "slug": slugId }, '_id');
    
            if (!category) {
                res.status(404).json({ error: 'Category not found' });
                return;
            }
    
            const categoryID = category._id;
    
            const page = req.query.page || 1;
            const limitPage = 8;
    
            const totalPosts = await SalePost.countDocuments({ "category": categoryID });
            const maxPage = Math.ceil(totalPosts / limitPage);
    
            const salePosts = await SalePost.find({ "category": categoryID })
                .sort({ createdAt: -1 })
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
                });
    
            res.json({ salePosts: salePosts, maxPage: maxPage });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
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

    async getRelated(req, res, next) { // lấy ngẫu nhiên 5 bài post liên quan (dựa vào category chung)
        const cateId = req.params.idCategory;
        await SalePost.aggregate([
            { $match: { "category": ObjectId(cateId)} }, // Lọc theo id nếu cần thiết
            { $sample: { size: 5 } }   // Lấy ngẫu nhiên 5 bản ghi
        ])
        .then(
            (salePosts) => {
                res.json(salePosts);

            }
        )
        .catch(
            (error) => {
                res.json({
                    error: error
                });
            }
        );
    }

    
}

module.exports = new SalePostController();