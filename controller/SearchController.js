const SalePost = require("../model/SalePost")
const Comment = require("../model/SalePost")
const Category = require("../model/Category")

function removeVietnameseTones(str) {
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
    return str;
}

class SearchController {
    // async search(req, res, next) {
    //     // Lấy tiêu đề cần tìm kiếm từ tham số của request
    //     const title = req.params.keyword;
    //     // Chuẩn hóa tiêu đề cần tìm kiếm thành không dấu
    //     const normalizedSearchTerm = removeVietnameseTones(title);
    
    //     // Tách tiêu đề thành các từ khóa
    //     const keywords = normalizedSearchTerm.split(' ').map(keyword => removeVietnameseTones(keyword));
    
    //     // Tạo các điều kiện $or cho mỗi từ khóa
    //     const orConditions = keywords.map(keyword => ({
    //         $expr: {
    //             $regexMatch: {
    //                 input: { $toLower: { $replaceAll: { input: '$title', find: 'đ', replacement: 'd' } } },
    //                 regex: new RegExp(keyword, 'i')
    //             }
    //         }
    //     }));
    
    //     try {
    //         // Sử dụng aggregate để thực hiện truy vấn và tính toán số từ khóa trùng khớp
    //         const saleposts = await SalePost.aggregate([
    //             { $match: { $or: orConditions } }, // Tìm kiếm các bản ghi có chứa ít nhất một từ khóa
    //             { 
    //                 $addFields: {
    //                     matchCount: {
    //                         $size: {
    //                             $filter: {
    //                                 input: keywords,
    //                                 as: "keyword",
    //                                 cond: { $regexMatch: { input: { $toLower: { $replaceAll: { input: '$title', find: 'đ', replacement: 'd' } } }, regex: new RegExp("$$keyword", 'i') } }
    //                             }
    //                         }
    //                     }
    //                 }
    //             },
    //             { $sort: { matchCount: -1 } } // Sắp xếp theo số từ khóa trùng khớp giảm dần
    //         ]);
    
    //         res.json(saleposts);
    //     } catch (error) {
    //         res.json({ error: error });
    //     }
    // }

    async search(req, res, next) {
        const title = req.params.keyword;
        const normalizedSearchTerm = removeVietnameseTones(title);
        const keywords = normalizedSearchTerm.split(' ').map(keyword => removeVietnameseTones(keyword));
        const orConditions = keywords.map(keyword => ({
            $expr: {
                $regexMatch: {
                    input: { $toLower: { $replaceAll: { input: '$title', find: 'đ', replacement: 'd' } } },
                    regex: new RegExp(keyword, 'i')
                }
            }
        }));
    
        var page = req.query.page || 1;
        var limitPage = 8;
    
        try {
            // Tính tổng số bài viết khớp với điều kiện tìm kiếm và thêm điều kiện isLock và isSold
            const totalPosts = await SalePost.countDocuments({
                $or: orConditions,
                isLock: false,
                isSold: false
            });
            const maxPage = Math.ceil(totalPosts / limitPage);
    
            // Sử dụng aggregate để thực hiện truy vấn và tính toán số từ khóa trùng khớp, đồng thời thêm phân trang
            const saleposts = await SalePost.aggregate([
                { $match: { $and: [{ $or: orConditions }, { isLock: false }, { isSold: false }] } },
                {
                    $addFields: {
                        matchCount: {
                            $size: {
                                $filter: {
                                    input: keywords,
                                    as: "keyword",
                                    cond: { $regexMatch: { input: { $toLower: { $replaceAll: { input: '$title', find: 'đ', replacement: 'd' } } }, regex: new RegExp("$$keyword", 'i') } }
                                }
                            }
                        }
                    }
                },
                { $sort: { matchCount: -1 } },
                { $skip: (page - 1) * limitPage },
                { $limit: limitPage }
            ]);
    
            res.json({
                salePosts: saleposts,
                maxPage: maxPage
            });
        } catch (error) {
            res.json({ error: error });
        }
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
}

module.exports = new SearchController();