const checkout = async (req, res) => {
  try {
      const productDatas = await productData.find();

      if (req.session.user) {
          const userDatas = req.session.user;
          const userMeta = await userData.findById(userDatas._id)
          // const walletBalance = userMeta.wallet.balance;
          console.log("walletBalance",walletBalance)
          req.session.checkout = true;

          const userId = userDatas._id;
          const  userMetas = await userData.findById(userId);
          const wishlistLength = userMetas.wishlist.length;
          
          const addressData = await Address.find({ userId: userId });
          const bannerData = await Banner.find({ active: true });

          const categoryData = await Category.find({ is_blocked: false });

          const user = await userData
              .findOne({ _id: userId })
              .populate({ path: "cart" })
              .populate({ path: "cart.product", model: "productCollection" });
          const cart = user.cart;
          let subTotal = 0;

          cart.forEach((val) => {
              val.total = val.product.price * val.quantity;
              subTotal += val.total;
          });

          //

          const now = new Date();
          const availableCoupons = await Coupon.find({
              expiryDate: { $gte: now },
              usedBy: { $nin: [userId] },
              status: true,
          });

          res.render("checkout", {
              addressData,
              bannerData,
              productDatas,
              userDatas,
              cart,
              wishlistLength,
              walletBalance,
              availableCoupons,
              subTotal,
              categoryData,
              loggedIn: true,
              message: "true",
          });
      }
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
};





