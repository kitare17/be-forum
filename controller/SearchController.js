const SalePost = require("../model/SalePost")
const Comment = require("../model/SalePost")
const Category = require("../model/Category")

function removeVietnameseTones(str) {
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    str = str.replace(/đ/g, 'd').replace(/Đ/g, 'D');
    return str;
}

class SearchController {
    async search(req, res, next) {
        // Lấy tiêu đề cần tìm kiếm từ tham số của request
        const title = req.params.keyword;
        // Chuẩn hóa tiêu đề cần tìm kiếm thành không dấu
        const normalizedSearchTerm = removeVietnameseTones(title);
    
        // Tách tiêu đề thành các từ khóa
        const keywords = normalizedSearchTerm.split(' ').map(keyword => removeVietnameseTones(keyword));
    
        // Tạo các điều kiện $or cho mỗi từ khóa
        const orConditions = keywords.map(keyword => ({
            $expr: {
                $regexMatch: {
                    input: { $toLower: { $replaceAll: { input: '$title', find: 'đ', replacement: 'd' } } },
                    regex: new RegExp(keyword, 'i')
                }
            }
        }));
    
        try {
            // Sử dụng aggregate để thực hiện truy vấn và tính toán số từ khóa trùng khớp
            const saleposts = await SalePost.aggregate([
                { $match: { $or: orConditions } }, // Tìm kiếm các bản ghi có chứa ít nhất một từ khóa
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
                { $sort: { matchCount: -1 } } // Sắp xếp theo số từ khóa trùng khớp giảm dần
            ]);
    
            res.json(saleposts);
        } catch (error) {
            res.json({ error: error });
        }
    }
}

module.exports = new SearchController();