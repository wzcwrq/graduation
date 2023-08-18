
Page({

  data: {

  },

  onLoad(options) {
    
  },

  username(event){
    var that = this
    // wx.getUserProfile({
    //   name: 'getuserinfo',
    //   desc: '用于完善用户信息',
    //   success: (res) => {
    //   console.log(res);
    //   }
// }}
    wx.cloud.callFunction({
      name: 'getuserinfo',
      complete: res => {
        console.log('callFunction result: ',res)
      }
    })
  },
  tosafe(){
    wx.navigateTo({
      url: '/pages/safe/safe',
    })
  },
  tocommon(){
    wx.navigateTo({
      url: '/pages/common/common',
    })
  },
  toaboutus(){
    wx.navigateTo({
      url: '/pages/aboutus/aboutus',
    })
  }
})