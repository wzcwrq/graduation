// pages/topassword/change_pw/index.js
import Toast from '@vant/weapp/toast/toast';
var userlogin = require('../../../userlogin.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    truecolor:'#06bd60',
    errorcolor:'#bd2806',
    firstpassword:['','',''],
    secondpassword:'',
    show:['password','text'],
    icon:['closed-eye','eye-o'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },


  firstpassword(event){
    var that = this
    var value = event.detail.value
    if(userlogin.checkPassword(value)){
      that.setData({
        firstpassword:[value,that.data.truecolor,'']
        })
    }else{
      that.setData({
        firstpassword:[value,that.data.errorcolor,"密码长度需为6-12字符且由数字和字母组成"]
        })
    }
  },

  onclick_icon(){
    var that = this
    this.setData({
      show:[that.data.show[1],that.data.show[0]],
      icon:[that.data.icon[1],that.data.icon[0]]

    })
  },

  secondpassword(e){
    var that = this
    that.setData({
      secondpassword:e.detail.value
    })
  },

  onsave(){
    if(this.data.firstpassword[0] != '' && this.data.firstpassword[0] == this.data.secondpassword){
        try {
          wx.setStorageSync('password', this.data.secondpassword)
        } catch (e) { 
        }
        finally{
            wx.reLaunch({
            url: '/pages/login/login',
        })           
        }  
    }else{

      console.log("错误")
    }
   
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