// pages/tousername/tousername.js
var info = require('../../info.js');
const db = wx.cloud.database({
  env: 'userinfo-7g22uj334d44b764'
})
const collection = db.collection('user')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    truecolor:'#06bd60',
    errorcolor:'#bd2806',
    username:['','','']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this
    try{
      var username = wx.getStorageSync('username')
      var [,phonenumber,,,,] = info.getuserregisterinfo()
    }catch{
    }finally{
      that.setData({
      phonenumber:phonenumber,
      username:[username,'','']
    })
    }
  },

  on_check_username(event){
    var that = this
    if( event.detail.value.length <= 6 && event.detail.value.length>=2){
      that.setData({
        username:[event.detail.value,that.data.truecolor,'']
      })  
    }else{
        that.setData({
          username:[event.detail.value,that.data.errorcolor,"请输入字符长度为2-6的用户名"]
        })
    }
  },

  finish(){
    var that = this
    const _ = db.command
    try {
        collection.where({
        phonenumber: that.data.phonenumber
      })
      .update({
        data: {
          username: _.set(this.data.username[0])
        },
      })
    } catch(e) {
      console.error(e)
    }finally{
      try{
        wx.setStorageSync('username', this.data.username[0])
      }catch{
      }finally{
        console.log(this.data.username[0])
        wx.navigateBack({
          url: '/pages/safe/safe',
      })  
      }
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