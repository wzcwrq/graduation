// pages/vent/vent.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radio: 1,
    value: 100,
    //color:['#ddf427','#f04e04','#f4ce0e','#ddf427','#f04e04'],
    gradientColor: {
      '0%': '#ddf427',
      '25%':'#fd471c',
      '50%':'#f4ce0e',
      '75%':'#ddf427',
      '100%': '#fd471c',
    },
  },
//f4ce0e
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    that.get_vent()
    // setInterval(function(){
    //   that.cycle()
    // },5000)
  },

   get_vent(){
    var that = this
    try {
      var radio = wx.getStorageSync('radio')
      radio = radio == null ? 1 : radio
      console.log(radio)
    } catch (e) {
      console.log("获取失败")
    }finally{
        console.log("在缓存中找到风机信息")
        that.setData({
        radio:radio,
      })
    }
  },


  save_vent(){
    var that = this
    try {
      wx.setStorageSync('radio', that.data.radio)
    } catch (e) { 
    }
    finally{
        wx.navigateBack({
        url: '/pages/index/index',
    })           
    }  
  },

  onChange(event) {
    console.log(event.detail)
    this.setData({
      radio: event.detail,
    });
  },
  onClick(event) {
    const { name } = event.currentTarget.dataset;
    this.setData({
      radio: name,
    });
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
    var that = this
    that.save_vent();
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