const Wishlist = require('../model/Wishlist');

class WishlistController {
    async togglePostInWishlist(req, res, next) {
        
        
        const userId = req.body.userId;
        const salePostId = req.body.salePostId;

        try {
            // Tìm wishlist của người dùng
            let wishlist = await Wishlist.findOne({"userId":userId});

            if (!wishlist) {
                // Nếu không tìm thấy wishlist, tạo mới một wishlist và thêm bài đăng vào
                wishlist = new Wishlist({
                    userId,
                    postLiked: [salePostId]
                }); 
            } else {
                // Nếu tìm thấy wishlist, kiểm tra xem bài đăng có trong wishlist chưa
                const index = wishlist.postLiked.indexOf(salePostId);
                if (index === -1) {
                    // Nếu bài đăng chưa có, thêm bài đăng vào mảng wishList
                    wishlist.postLiked.push(salePostId);
                } else {
                    // Nếu bài đăng đã có, loại bỏ bài đăng khỏi mảng wishList
                    wishlist.postLiked.splice(index, 1);
                }
            }

            await wishlist.save();
            res.status(200).json(wishlist);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async getOne(req, res, next){ //done
        const id=req.params.userid;
        await Wishlist.findOne({"userId":id})
            .populate({
                path: 'postLiked'

            })
            .then(
                (wishlist)=>{
                    res.json(wishlist)
                    // res.send(id)
                }
            )
            .catch(
                err=>{
                    err
                }
            )
    }
}

module.exports = new WishlistController();