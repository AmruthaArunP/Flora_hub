////////////////////View_Order/////////////
const viewOrders = async (req, res) => {
    try {
        const productDatas = await productData.find();
        let orderData = await Order.find().sort({ date: -1 })
        const userDatas = await userData.findOne();
        const categoryData = await Category.find({ is_blocked: false });
        console.log(userDatas);
        const userId = userDatas._id;

        const user = await userData.findOne({ _id: userId }).populate({ path: 'cart' }).populate({ path: 'cart.product', model: 'productCollection' });
        const customerName = user.user_name;
        
        const cart = user.cart;
        
        let subTotal = 0;
        cart.forEach((val) => {
            val.total = val.product.price * val.quantity;
            subTotal += val.total;
        });

        res.render("viewOrders", { productDatas,user, userDatas, orderData, cart, subTotal, categoryData, message: "true" });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};



///////////////////////////////update_order///////////////

const updateOrder = async (req, res) => {
    try {
        const orderId = req.query.orderId;
        const status = req.body.status;
        console.log(orderId, status);


        if (status === "Delivered") {

            const returnEndDate = new Date()
            returnEndDate.setDate(returnEndDate.getDate() + 7)

            await Order.findByIdAndUpdate(orderId, 
                { $set: { 
                    status: status, 
                    deliveredDate: new Date(), 
                    returnEndDate: returnEndDate,                    
                },
                $unset: { ExpectedDeliveryDate: "" }
            }, 
                { new: true });
        }else if (status === "Cancelled") {

            await Order.findByIdAndUpdate(orderId, 
                { $set: { 
                    status: status,                   
                },
                $unset: { ExpectedDeliveryDate: "" }
            }, 
                { new: true });
        }
        
        
        else {
            await Order.findByIdAndUpdate(orderId, 
                { $set: { 
                    status: status } }, 
                { new: true });
        }

        res.json({
            messaage: "Success",
        });
    } catch (error) {
        console.log(error.message);
    }
};

///////////my account////////////////////
const my_account = async (req, res) => {


    try {
  
      if (req.session.user) {
        const userDatas = req.session.user;
        const userId = userDatas._id;
        const categoryData = await Category.find({ is_blocked: false });
        const addressData = await Address.find({ userId: userId });
        const orderData = await Order.find({ userId: userId });
        const productDatas = await productData.find();
  
       
  
        //transactions data here
        req.session.checkout = true
        // walletBalance=userDatas.wallet.balance
        const user = await userData.findOne({ _id: userId }).populate({ path: 'cart' }).populate({ path: 'cart.product', model: 'productCollection' });
        const profilename = userDatas.user_name
  
        const cart = user.cart;
        let subTotal = 0;
  
        cart.forEach((val) => {
          val.total = val.product.price * val.quantity;
          subTotal += val.total;
        });
        res.render("my_account", { userDatas, orderData, categoryData, cart, addressData, profilename, message: "true", productDatas, subTotal });
      } else {
        res.render("my_account", { cart, addressData, profilename, message: "false" });
  
      }
    } catch (error) {
      console.log(error.message);
    }
  
  };