const userData = require("../model/user_register");
const helperFunction = require("../../helperFunctions/userHelper");
const bcrypt = require("bcrypt");
const Category = require("../model/categoryModel");
const productData = require("../model/product");
let generatedOtp;
let user_name;
let emailId;
let mobile;
let address;
let password;
let forgotPasswordOtp


const index = async (req, res) => {
  try {
    const productDatas = await productData.find();
    const logged = req.session.user
    
    if(req.session.user){
      const userDatas = req.session.user
      
    // req.session.checkout = true

    const userId = userDatas._id
    const categoryData = await Category.find({ is_blocked: false });

      res.render("index", { productDatas,userDatas, message: "true"});
    }else{
      res.render("index",{productDatas,logged ,message:"false"});

    }
   
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

//user Registration
const user_register = (req, res) => {
    try {
      res.render("user_register", { message: "" });
      if (req.session.user) {
        res.redirect("my_account");
      } else {
        res.render("user_register", { userSignup: true });
      }
    } catch (error) {
      console.log(error);
    }
  };

  //user registration POST

  const user_register_post = async (req, res) => {
    try {
      let { email, phone } = req.body;
      const emailExist = await userData.findOne({ email: email });
      const phoneExist = await userData.findOne({ phone: phone });
      const valid = helperFunction.validateRegister(req.body);
  
      if (emailExist) {
        return res.status(401).json({
          error:
            "user with same email Id already exists please try another email",
        });
      } else if (phoneExist) {
        return res.status(405).json({
          error:
            "The user with same mobile number already exist please try another number",
        });
      } else if (!valid.isValid) {
        return res.status(400).json({ error: valid.errors });
      } else {
        generatedOtp = helperFunction.generateOTP();
        user_name = req.body.user_name;
        emailId = req.body.email;
        mobile = req.body.phone;
        address = req.body.address;
        // password = await bcrypt.hash(req.body.password, 10);  
        password=req.body.password;
        helperFunction.sendOtpMail(email, generatedOtp);
        return res.status(200).end();
      }
    } catch (error) {
      console.log(error);
    }
  };

// OTP Verification
const otp_verification = async (req, res) => {
    res.render("otp_verification", { message: "" });
  };
  
  const otp_verification_post = async (req, res) => {
    try {
      var txt1 = req.body.txt1;
      var txt2 = req.body.txt2;
      var txt3 = req.body.txt3;
      var txt4 = req.body.txt4;
      const EnteredOtp = txt1 + txt2 + txt3 + txt4;
  
      if (EnteredOtp === generatedOtp) {
        const securedPassword = await helperFunction.securePassword(password);
  
        const newUser = new userData({
          user_name: user_name,
          email: emailId,
          phone: mobile,
          address: address,
          password: securedPassword,
  
          is_blocked: false,
        });
   
        await newUser.save();
        console.log("-user data saved in the database-");
        res.render("user_login", {
          message: "Successfully registered!",
          loggedIn: false,
          blocked: false,
        });
      } else {
        res.render("otp_verification", { message: "wrong OTP" });
      }
    } catch (error) {
      console.log(error);
      res.render("otp_verification", {
        message: "Error registering new user",
        loggedIn: false,
      });
    }
  };
      //resend otp
  const resendOtp = (req, res) => {
    try {
      const newOtp = helperFunction.generateOTP();
      generatedOtp = newOtp;
      helperFunction.sendOtpMail(emailId, newOtp);
      console.log(`+ new_otp ${newOtp}`);
    } catch (error) {
      console.log(error);
    }
  };

  //forgot password
 
  const forgot_password = async (req, res) => {
    try {
        const categoryData = await Category.find({ is_blocked: false });
    
        if (req.session.forgotEmailNotExist) {
           
            res.render("forgot_password", {categoryData,emailNotExist: "Sorry, email does not exist! Please register now!" ,loggedIn:false,walletBalance,subTotal:0,cart:{}});
            req.session.forgotEmailNotExist = false;
        } else {
            res.render("forgot_password",{loggedIn:false,categoryData});
        }
    } catch (error) {
        console.log(error.message);
    }
};

  
  // verifying email and sending otp
  const verifyForgotEmail = async (req, res) => {
    try {
        const verifyEmail = req.body.email;
        const ExistingEmail = await userData.findOne({ email: verifyEmail });

        if (ExistingEmail) {
            if (!forgotPasswordOtp) {
                forgotPasswordOtp = helperFunction.generateOTP();
                console.log(forgotPasswordOtp);
                emailId = verifyEmail;
                helperFunction.sendOtpMail(emailId, forgotPasswordOtp);
                res.redirect("/forgotOtpEnter");
                setTimeout(() => {
                    forgotPasswordOtp = null;
                }, 60 * 1000);
            } else {
                res.redirect("/forgotOtpEnter");
            }
        } else {
            req.session.forgotEmailNotExist = true;
            res.redirect("/forgotPassword");
        }
    } catch (error) {
        console.log(error.message);
    }
};



const showForgotOtp = async (req, res) => {
  try {
      const categoryData = await Category.find({ is_blocked: false });
      if (req.session.wrongOtp) {
          res.render("forgotOtpEnter", { invalidOtp: "Otp does not match" ,loggedIn:false});
          req.session.wrongOtp = false;
      } else {
          res.render("forgotOtpEnter", { countdown: true ,loggedIn:false, invalidOtp:"" });
      }
  } catch (error) {
      console.log(error.message);
  }
};

const verifyForgotOtp = async (req, res) => {
  try {
      var txt1=req.body.txt1;
      var txt2 =req.body.txt2
      var txt3=req.body.txt3
      var txt4=req.body.txt4
      const userEnteredOtp = txt1+txt2+txt3+txt4
   
      if (userEnteredOtp === forgotPasswordOtp) {
          res.render("passwordReset",{loggedIn:false,invalidOtp:""});
      } else {
          req.session.wrongOtp = true;
          res.redirect("/forgotOtpEnter");
      }
  } catch (error) {
      console.log(error.message);
  }
};

const resendForgotOtp = async (req, res) => {
    try {
      const generatedOtp = helperFunction.generateOTP();
      forgotPasswordOtp = generatedOtp;

      helperFunction.sendOtpMail(emailId, forgotPasswordOtp);
      res.redirect("/forgotOtpEnter");
      setTimeout(() => {
          forgotPasswordOtp = null;
      }, 60 * 1000);
  } catch (error) {
      console.log(error.message);
  }
};

const updatePassword = async (req, res) => {
  try {
      const newPassword = req.body.password;
      const securedPassword = await helperFunction.securePassword(newPassword);

      const userDataS = await userData.findOneAndUpdate({ email: emailId }, { $set: { password: securedPassword } });
      if (userDataS) {
          req.session.passwordUpdated = true;
          res.render("user_login",{blocked:false,loggedIn:false});
      } else {
          console.log("Something error happened");
      }
  } catch (error) {
      console.log(error.message);
  }
};

       //login get

   const user_login = (req, res) => {
    
    if (req.session.user) {
      res.redirect("/my_account");
    } else {
      res.render("user_login", { message: "" });
    }
  };



  // User Login Post
const user_login_post = async (req, res) => {
  try {
    const { user_name, password } = req.body;
    console.log(user_name)
    if (!user_name || !password) {
      res.render("user_login", {
        message: "Username and Password can't be empty",
      });
    }
    let email = user_name;
    let exist = await userData.findOne({ email: email });
    console.log(exist);
    if (exist) {
      if (exist.is_blocked) {
        res.render("user_login", { message: "You account is blocked !!" });

      }


      const decodedPassword = await bcrypt.compare(password, exist.password);
      const userStatus = exist.is_blocked;

      if (decodedPassword && userStatus == false) {
        req.session.user = exist;
        console.log(11);
        res.render("index");

      } else {
        res.render("user_login", { message: "The password is incorrect" });
      }
    } else {
      res.render("user_login", { message: "User not found please signup" });
    }
  } catch (error) {
    console.log(error);
  }
};



const my_account =async (req, res) => {
  try {
    if(req.session.user){
    const userDatas = req.session.user;
  
    const categoryData = await Category.find({ is_blocked: false });
  
    // const productDatas = await productData.find();
    const profilename=userDatas.user_name
    res.render("my_account", { userDatas, categoryData, profilename,message:"true"});
  }else{
    res.render("my_account", { profilename,message:"false"});

  }
} catch (error) {
    console.log(error.message);
}
 
};

const shop = async (req, res) => {
  try {
    const productDatas = await productData.find();
    const logged = req.session.user
        if(req.session.user){
      const userDatas = req.session.user
      res.render("shop", { productDatas,userDatas, message: "true"});
    }
    else{
      res.render("shop",{productDatas,logged ,message:"false"});
    }

  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

const user_logout = (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log("Error destroying session:", err);
      } else {
        res.redirect("/user_login"); // Redirect to the login page after logout
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports={
    index,
    user_register,
    user_register_post,
    otp_verification_post,
    otp_verification,
    showForgotOtp,
    resendOtp,
    verifyForgotOtp,
    resendForgotOtp,
    updatePassword,
    forgot_password,
    user_login,
    user_login_post,
    verifyForgotEmail,
    my_account,
    shop,
    user_logout
}
