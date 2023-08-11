// const customerData = require("../models/mongo")
const customerData = require("../model/user_register");

const adminSignin = (req, res) => {
    if (req.session.admin) {
        res.redirect("/admin_dashboard");
    } else {
        res.render("sign_in", { message: "" });
    }
};

const adminSigninPost = (req, res) => {
    const { email, password } = req.body;
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        req.session.admin = email;
        res.redirect("admin_dashboard");
    } else {
        res.render("sign_in", { message: "Invalid username or password", admin: true });
    }
};

const adminDashboard = (req, res) => {
    res.render('admin_dashboard');
};

const viewCustomers=async(req,res)=>{


}



const adminLogout = (req, res) => {
    delete req.session.admin;
    res.redirect("/admin_sign_in"); // Redirect to the login page after logout
};








module.exports = {
    adminSignin,
    adminSigninPost,
    adminDashboard,
    adminLogout,
    viewCustomers
};


