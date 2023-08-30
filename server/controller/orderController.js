const userData = require("../model/user_register");
const productData = require("../model/product");
const Category = require("../model/categoryModel");
const Address = require("../model/address");
const Order = require("../model/order");


const checkout = async (req, res) => {

    try {
        const productDatas = await productData.find();


        if (req.session.user) {
            const userDatas = req.session.user
            req.session.checkout = true

            const userId = userDatas._id
            const addressData = await Address.find({ userId: userId });

            const categoryData = await Category.find({ is_blocked: false });

            const user = await userData.findOne({ _id: userId }).populate({ path: 'cart' }).populate({ path: 'cart.product', model: 'productCollection' });
            const cart = user.cart;
            let subTotal = 0;

            cart.forEach((val) => {
                val.total = val.product.price * val.quantity;
                subTotal += val.total;
            });

            //

            const now = new Date();
            res.render("checkout", { addressData, productDatas, userDatas, cart,  subTotal, categoryData, loggedIn: true, message: "true" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};




const placeOrder = async (req, res) => {
    try {
        //   console.log("placorder middleware..")
        const userDatas = req.session.user;
        // walletBalance=userDatas.wallet.balance
        const userId = userDatas._id;
        // console.log(userId)
        const addressId = req.body.selectedAddress;
        const amount = req.body.amount;
        const paymentMethod = req.body.selectedPayment;

        const user = await userData.findOne({ _id: userId }).populate("cart.product");
        // const user = await userData.findOne({ _id: userId }).populate({path: 'cart'}).populate({path: 'cart.product', model: 'productCollection'});
        //   console.log(user)
        const userCart = user.cart;

        let subTotal = 0;

        userCart.forEach((item) => {
            item.total = item.product.price * item.quantity;
            subTotal += item.total;
        });

            let productDatas = userCart.map((item) => {
            return {
                id: item.product._id,
                name: item.product.product_name,
                category: item.product.category,
                price: item.product.price,
                quantity: item.quantity,
                image: item.product.imageUrl[0].url,
            };
        });

        const result = Math.random().toString(36).substring(2, 7);
        const id = Math.floor(100000 + Math.random() * 900000);
        const orderId = result + id;

        let saveOrder = async () => {

            const ExpectedDeliveryDate = new Date()
            ExpectedDeliveryDate.setDate(ExpectedDeliveryDate.getDate() + 3)

           
                const order = new Order({
                    userId: userId,
                    product: productDatas,
                    address: addressId,
                    orderId: orderId,
                    total: subTotal,
                    ExpectedDeliveryDate: ExpectedDeliveryDate,
                    paymentMethod: paymentMethod,
                });

                const orderSuccess = await order.save();
            

            let userDetails = await userData.findById(userId);
            let userCartDetails = userDetails.cart;

            userCartDetails.forEach(async (item) => {
                const productId = item.product;
                const quantity = item.quantity;

                const product = await productData.findById(productId);
                // const stock = product.stock;
                const stock = 100;
                const updatedStock = stock - quantity;

                await productData.findByIdAndUpdate(
                    productId,
                    { $set: { stock: updatedStock, isOnCart: false } },
                    { new: true }
                );
            });

            userDetails.cart = [];
            await userDetails.save();
        };

        if (addressId) {
            if (paymentMethod === "Cash On Delivery") {

                saveOrder();
                req.session.checkout = false

                res.json({
                    order: "Success",
                });

            } 
        }
    } catch (error) {
        console.log(error.message);
    }
};

const orderSuccess = async (req, res) => {
    try {
        const userData = req.session.user;
        const categoryData = await Category.find({ is_blocked: false });
        var useremail = req.session.user.email
        res.render("orderSuccess", { userData, categoryData, loggedIn: true, useremail, });
    } catch (error) {
        console.log(error.message);
    }
};
const orderDetails = async (req, res) => {
    try {

        const orderId = req.query.orderId;

        const orderDetails = await Order.findById(orderId);
        const orderProductData = orderDetails.product;
        const addressId = orderDetails.address;

        const addressData = await Address.findById(addressId);

        res.render("orderDetails", {orderDetails,orderProductData,addressData,user: req.session.admin});
    } catch (error) {
        console.log(error.message);
    }
};
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






module.exports = {
    checkout,
    orderSuccess,
    placeOrder,
    orderDetails,
    updateOrder

}