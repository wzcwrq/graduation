// pages/logout/surelogout/surelogout.js
var info = require('../../../info.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    account:'',
    phonenumber:'',
    password:'',
    url:'',
    temp_password:'',
    count:0,
    time:0,
    failtime:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    const [account,phonenumber,password,url] = info.getuserregisterinfo()
    try{
      var failtime = wx.getStorageSync('failtime')
    }catch(e){
    }finally{
    }

    that.setData({
      account:account,
      phonenumber:phonenumber,
      password:password,
      url:url,
      failtime:failtime
    })
  },

  oncheck(e){
    var that = this
    that.setData({
      temp_password : e.detail.value
    })
  },

  clear(e){
    var that = this
    var date = new Date();
    var time = date.getTime() - 1676000000000
    
    if(time - that.data.failtime > 86400){
      if(that.data.temp_password == that.data.password){
        console.log("密码正确，注销成功")
          try {
            wx.clearStorageSync()
          } catch(e) {
              console.log("网络错误，注销失败")
          }finally{
            wx.reLaunch({
              url: '/pages/login/login',
            })
          }
        }else if(that.data.count == 2){
            try{
              wx.setStorageSync('failtime', time)
            }catch(e){
            }
            that.setData({
              count:0,              
              time :time,
              failtime:time
            }) 
            
          }else{
            that.setData({
              count : that.data.count + 1,
            })   
            console.log('密码错误，注销失败')
          }
        }else{
          console.log("密码次数错误达到3次，24小时内禁止进行注销")
        }
  },
})