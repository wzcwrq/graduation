//验证手机号码、密码、验证码、设备号

function checkPhone(phonenumber) {
  var reg = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
  if (reg.test(phonenumber)) {
    return true
  } 
  else {
  return false
  }
};


function checkPassword(password) {
  var reg = /^(?=.*\d)(?=.*[a-zA-Z]).{6,12}$/;
  if (reg.test(password)) {
    return true
  } 
  else {
  return false
  }
};

function checkSms(sms) {
  var reg = /^\d{4}$/;
  if (reg.test(sms)) {
    return true
  } 
  else {
  return false
  }
};

function checkUrl(url) {
  var reg = /^\d{10}$/;
  if (reg.test(url)) {
    return true
  } 
  else {
  return false
  }
};

module.exports = {
  checkPhone : checkPhone,
  checkPassword : checkPassword,
  checkSms : checkSms,
  checkUrl:checkUrl
}
  