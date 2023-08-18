var info = require('../../info.js');

Page({
  data: {
    show: false,
    account:'',
    phonenumber:'',
    password:'',
  },


  onLoad() {
    var that = this
    const [account,phonenumber,password,url] = info.getuserregisterinfo()
    
    that.setData({
      url:url,
      account:account,
      phonenumber:phonenumber,
      password:password,
    })

  },

  tousername(){
    wx.navigateTo({
      url: '/pages/tousername/tousername',
    })
  },
  toaccount(){
    wx.navigateTo({
      url: '/pages/toaccount/toaccount',
    })
  },
  topassword(){
    wx.navigateTo({
      url: '/pages/topassword/topassword',
    })
  },



  login(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  register(){
    wx.navigateTo({
      url: '/pages/register/register',
    })
  },

  quit(){
    this.setData({ show: true });
  },

  logout(){
    wx.navigateTo({
      url: '/pages/logout/logout'
    })
  },
  no(){
    this.setData({ show: false });
  },
  sure(){
    wx.reLaunch({
      url: '/pages/login/login',
    })
  },

  onClose() {
    this.setData({ show: false });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})