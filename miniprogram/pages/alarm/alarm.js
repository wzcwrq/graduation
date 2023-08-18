// packageA/pages/alarm/alarm.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    that.get_alarm_info()
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


  // 获取设备警报信息
get_alarm_info(){
  var that = this
  //请将下方device_id 改为设备id
  const device_id = '1064411779'
  wx.request({
    url: `https://api.heclouds.com/devices/${device_id}/datapoints?start=2023-01-01T23:30:00&limit=30&sort=DESC`,             //参考OneNET平台url规则
    header:{
      "api-key":`PNQQrh5QHNxQXbpFSwNsNCbVv=g=`         //OneNET平台设备api-key
    },
    method:"GET",
    success:function(e){
      var datas = e.data.data
      // console.log(datas)
      that.setData({
        t0:datas.datastreams[1].datapoints[0].at.substring(0,19),
        hum:datas.datastreams[1].datapoints[0].value,
        temper:datas.datastreams[3].datapoints[0].value,
        PM25:datas.datastreams[4].datapoints[0].value,
        MQ5:datas.datastreams[0].datapoints[0].value,
        alarm:datas.datastreams[5].datapoints[0].value,
        vent:datas.datastreams[2].datapoints[0].value,
      })     
    },
    fail(e){
      Toast.fail('网络错误，请重试')
    }
  })
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