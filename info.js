//onenet http 1046026206
//const apikey = "9=283=hVx259PJLadsOUAg9TqU8="
const apikey = "C=nzb7fn2UL=5ZbC8mTZ29mWAkM="

//onenet mqtt 1060653727
//const apikey = "iJCP48EDyv5HDHBYxN1Y70O64mY="

const db = wx.cloud.database({
  env: 'userinfo-7g22uj334d44b764'
})
const collection = db.collection('device');
const _ = db.command
function getdevice(url){
  collection.where({
    url : _.eq(url)
  }).get({
    success:function(res){
      const datas = res.data[0]
      console.log(datas)
      return datas
    }
  })
}

  function geturl(){
    return url
  };

  function getapikey(){
    return apikey
  };

  function getphoneinfo(){
    //   // 设备像素比
    // console.log(phone.pixelRatio)
    // // 屏幕宽度，单位px
    // console.log(phone.screenWidth)
    // // 屏幕高度，单位px
    // console.log(phone.screenHeight)
    // // 可使用窗口宽度，单位px
    // console.log(phone.windowWidth)
    // // 可使用窗口高度，单位px
    // console.log(phone.windowHeight)
    // // 状态栏的高度，单位px
    // console.log(phone.statusBarHeight)
    // // 在竖屏正方向下的安全区域
    // console.log(phone.safeArea)
    // // 窗口上边缘的 y 值
    // console.log(phone.screenTop)
    const windowInfo = wx.getWindowInfo();
      try {
        wx.setStorageSync('screenWidth', windowInfo.screenWidth)
        wx.setStorageSync('windowHeight', windowInfo.windowHeight)
      } catch (e) { 
      }
    }

  function getdeviceinfo(){
      try {
        var url = wx.getStorageSync('url')
        var screenWidth = wx.getStorageSync('screenWidth')
        var windowHeight = wx.getStorageSync('windowHeight')
        var APIKey = wx.getStorageSync('APIKey')
        var a_APIKey = wx.getStorageSync('a_APIKey')
        var a_url = wx.getStorageSync('a_url')
      } catch (e) {
        console.log("获取信息失败")
      }finally{
        return [url,screenWidth,windowHeight,APIKey,a_APIKey,a_url]
      }
    }

  function getuserregisterinfo(){
    try {
      var account = wx.getStorageSync('account')
      var phonenumber = wx.getStorageSync('phonenumber')
      var password = wx.getStorageSync('password')
      var url = wx.getStorageSync('url')
      var screenWidth = wx.getStorageSync('screenWidth')
      var windowHeight = wx.getStorageSync('windowHeight')
    } catch (e) {
      console.log("获取信息失败")
    }finally{
      return [account,phonenumber,password,url,screenWidth,windowHeight]
    }
  }


  function getusermsg(){
    try {
      var phonenumber = wx.getStorageSync('phonenumber')
      var url = wx.getStorageSync('url')
    } catch (e) {
      console.log("获取信息失败")
    }finally{
      return [phonenumber,url]
    }
  }

/*云托管  已作废
const attime = "2023年3月5日15:40:17"
const type ="temper" 
async function getlinedata(attime,type){
  const app = getApp()
  const res = await app.call({
    path:`/api/air/?attime=${attime}&type=${type}`,
    method:'GET',
  })
  return res.data
} 
*/





module.exports = {
  geturl : geturl ,
  getapikey : getapikey,
  getphoneinfo:getphoneinfo,
  getdeviceinfo:getdeviceinfo,
  getuserregisterinfo:getuserregisterinfo,
  getusermsg:getusermsg,
  getdevice:getdevice,
}