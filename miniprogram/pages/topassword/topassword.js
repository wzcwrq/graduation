// pages/topassword/topassword.js
import Toast from '@vant/weapp/toast/toast';
var info = require('../../info.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    test:'0000',

    truecolor:'#06bd60',
    errorcolor:'#bd2806',

    password:'你的密码',
    sms:['',''],
    showcounttime:true,
    countdown: 1 * 1 * 3 * 1000,
    showbutton:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    const [account,phonenumber,password] = info.getuserregisterinfo()
    that.setData({
      phonenumber:phonenumber,
      password:password,
    })
  },

  // checkSms
  on_check_sms(event){
    var that = this
    if(event.detail.value == this.data.test){
      this.setData({
        sms:[event.detail.value,that.data.truecolor],
        showbutton:true
      })
    }else{
      this.setData({
        sms:[event.detail.value,that.data.errorcolor],
        showbutton:false
    })
  }
  },


  check_sure(){
    if(this.data.showbutton){
      wx.redirectTo({
            url: '/pages/topassword/change_pw/index'
          })
    }
  },

  send(){
    var that = this
    if(that.data.showcounttime){
      // 倒计时控制
      const countDown = this.selectComponent('.control-count-down');
      countDown.start();
      this.setData({
        showcounttime:false,
    })
    }
  },
  countdownfinish(){
    var that = this
    this.setData({
      count:0,
      showcounttime:true,
    })
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