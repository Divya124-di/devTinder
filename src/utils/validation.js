const validator = require('validator');
const validate = (req)=>{
  const { firstName, lastName, emailId, password } = req.body;
  if (!firstName || !lastName || !emailId || !password) {
    throw new Error("All fields are mandatory");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email Id");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Enter a strong password");
  } // else if(firstName.length<4 || firstName.length<50){
  //     throw new Error("First Name should be of length 4 to 50");
  // }
}

module.exports = validate;