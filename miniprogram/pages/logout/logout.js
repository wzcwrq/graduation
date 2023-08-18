// pages/logout/logout.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  
  tosurelogout(){
    wx.redirectTo({
      url: '/pages/logout/surelogout/surelogout'
    })
  },

})