import Toast from '@vant/weapp/toast/toast';
var info = require('../../info.js');
var date = new Date();
//获取当前时间 格式为 YYYY-MM-DD
var MM = date.getMonth() + 1
var DD = date.getDate()
var TT = date.getHours()
var MI = date.getMinutes()
var SS = date.getSeconds()
var time = `${date.getFullYear()}/${MM < 10 ? '0'+MM : MM}/${DD < 10 ? '0'+DD : DD} ${TT < 10 ? '0'+TT : TT}:${MI < 10 ? '0'+MI : MI}:${SS < 10 ? '0'+SS : SS}`;

var timeslot = date.getHours();
const deviceSubTopic = "/yunyao/sub"; //  设备订阅topic（小程序发布命令topic）
const mpPubTopic = deviceSubTopic;

var dan = '';
if(timeslot >6 && timeslot < 19){
  dan = ['rgba(255,50,0,1)', 'rgb(255, 143, 143)','msglogo']
}else{
  dan = ['rgb(38, 9, 146)', 'rgb(2, 24, 32)','msglogo2']
}

const color="#333333"

Page({
  data: {
    client:{},
    checkShow:1,
    flag:0,
    temper:['null',color],
    hum:['null',color],
    MQ5:['null',color],
    PM25:['null',color],
    vent:0,
    alarm:0,
    check:0,
    radio:1,
    //CH2O:['0',color],
    noticetext:['今日天气：','气温：','相对湿度：','风向：','风力：','风速:','当前小时降水量：','大气压强：','能见度：',''],
    notice: ['','','','','','','','','',''],
    notice2:['','℃','%','','级','公里每小时','毫米','百帕','公里',''],
    latitude:'',
    longitude:'',
    time:time,
    Stepper:false,
    Stepper1 : 30,
    Stepper2 : 80,
    Stepper3 : 100,
    Stepper4 : 100,
    url:'',
    screenWidth:'',
    windowHeight:'',
    APIKey:'',
    a_APIKey:'',
    a_url:'',
    x:'',
    y:'',
    redpoint:'',
    dan:dan,
  },

onLoad() {
  var that = this
  that.getuserdefaultinfo();
  const [url,screenWidth,windowHeight,APIKey,a_APIKey,a_url] = info.getdeviceinfo()
  that.setData({
    url:url,
    screenWidth:screenWidth,
    windowHeight:windowHeight,
    y:0.7*windowHeight,
    APIKey:APIKey,
    a_APIKey:a_APIKey,
    a_url:a_url
  })
  info.getphoneinfo()
  that.getlocation()  //获取用户地理信息用于实时天气获取
  //每10秒获取一次设备信息
  setInterval(function(){
      that.getinfo()
    },10000)

},

/**
* 生命周期函数--监听页面显示
*/
  onShow() {
    var that = this
    that.getdefaultinfo()
    // 每一秒获取一次时间
    setInterval(function(){
      that.gettime()
    },1000)
    //每两分钟获取一次实时天气
    setInterval(function(){
      that.getlocation()
    },10*60*1000)
    
  },

/**
* 生命周期函数--监听页面卸载
*/
  onUnload() {
    var that = this
    //that.putdefaultinfo()
    try {
      wx.setStorageSync('temp', that.data.temper[0])
      wx.setStorageSync('hum', that.data.hum[0])
      wx.setStorageSync('MQ5', that.data.MQ5[0])
      wx.setStorageSync('PM25', that.data.PM25[0])
      wx.setStorageSync('alarm', that.data.alarm)
      wx.setStorageSync('vent', that.data.vent)
      wx.setStorageSync('redpoint', that.data.redpoint)
    } catch (e) { 
    }
    finally{ 
  }
  },

/*
  获取通风机配置 1正转  2反转 
  获取安全值 
  获取通知设置
*/
  getdefaultinfo(){
    var that = this
    try {
      var radio   = wx.getStorageSync('radio')
      var switch1 = wx.getStorageSync('switch1')
      var switch2 = wx.getStorageSync('switch2')
      var switch3 = wx.getStorageSync('switch3')
      var switch4 = wx.getStorageSync('switch4')
      var Stepper = wx.getStorageSync('Stepper')
      var Stepper1 = wx.getStorageSync('Stepper1')
      var Stepper2 = wx.getStorageSync('Stepper2')
      var Stepper3 = wx.getStorageSync('Stepper3')
      var Stepper4 = wx.getStorageSync('Stepper4')
    } catch (e) {
      console.log("获取失败")
    }finally{
        console.log("在缓存中找到--风机--警报--安全值--设置")
        if(Stepper){
          that.putdefaultinfo2()
          that.setData({
            radio:radio,
            switch1:switch1,
            switch2:switch2,
            switch3:switch3,
            switch4:switch4,
            Stepper:false,
            Stepper1:Stepper1 == null ? 30 : Stepper1,
            Stepper2:Stepper2 == null ? 80 : Stepper2,
            Stepper3:Stepper3 == null ? 100 : Stepper3,
            Stepper4:Stepper4 == null ? 100 : Stepper4,
          })
        }
        
    }
  },

//获取注册信息
  getuserdefaultinfo(){
    var that = this
    try {
      var temp = wx.getStorageSync('temp')
      var hum = wx.getStorageSync('hum')
      var MQ5 = wx.getStorageSync('MQ5')
      var PM25 = wx.getStorageSync('PM25')
      var alarm = wx.getStorageSync('alarm')
      var vent = wx.getStorageSync('vent')
      var redpoint = wx.getStorageSync('redpoint')
    } catch (e) {
      console.log("获取失败")
    }finally{
        console.log("在缓存中找到用户信息")
        that.setData({
        temper:[temp,color],
        hum:[hum,color],
        MQ5:[MQ5,color],
        PM25:[PM25,color],
        alarm:alarm,
        vent:vent,
        redpoint:redpoint,
      })
    }
  },

// 获取设备实时信息       Onenet的MQTT（旧版)
async getinfo(){
  var that = this
  var temp = that.data.redpoint
  //const color="#d81e06"
  wx.request({
    url: `https://api.heclouds.com/devices/1060653727/datapoints`,
    header:{
      "api-key":'iJCP48EDyv5HDHBYxN1Y70O64mY='
    },
    method:"GET",
    success:function(e){
      var datas = e.data.data
      console.log(datas)
      var t_alarm = datas.datastreams[5].datapoints[0].value == 1 ? true : false
      var t_vent = datas.datastreams[3].datapoints[0].value == 1 ? true : false
      var t_check = datas.datastreams[6].datapoints[0].value
      if(that.data.flag){
          t_alarm = that.data.alarm
          t_vent = that.data.vent
      }
      that.setData({
        hum:[datas.datastreams[1].datapoints[0].value,datas.datastreams[1].datapoints[0].value >= that.data.Stepper2 ?'#d81e06':'#222222'],
        temper:[datas.datastreams[2].datapoints[0].value,datas.datastreams[2].datapoints[0].value >= that.data.Stepper1 ?'#d81e06':'#222222'],
        PM25:[datas.datastreams[4].datapoints[0].value,datas.datastreams[4].datapoints[0].value >= that.data.Stepper4 ?'#d81e06':'#222222'],
        MQ5:[datas.datastreams[0].datapoints[0].value,datas.datastreams[0].datapoints[0].value >= that.data.Stepper3 ?'#d81e06':'#222222'],
        alarm:t_alarm,
        vent:t_vent,
        check:datas.datastreams[6].datapoints[0].value,
        redpoint:t_check == 1 ? true : temp,
      })
      if(t_check==1){
        that.upload_alarm_info()//上传超限信息   
      }
      //that.upload_info()  //上传信息   
    },
    fail(e){
      Toast.fail('网络错误，请重试')
    }
  })
},

// 获取用户地理信息并用于获取实时天气信息
getlocation(){
  var that = this
  wx.getFuzzyLocation({
    type: 'wgs84',
    success (res) {
      //console.log("成功获取地理信息")
      const latitude = res.latitude;
      const longitude = res.longitude;
      const key = '3625f53e028e4e70aab4ed62b288aa5b';
      wx.request({
        url: `https://devapi.qweather.com/v7/weather/now?location=${longitude},${latitude}&key=${key}`,
        success(res){
          const now = res.data.now;
          //console.log(now)
          that.setData({
            notice:[now.text,now.temp,now.humidity,now.windDir,now.windScale,now.windSpeed,
            now.precip<0.01?0:now.precip,now.pressure,now.vis]
          })
        }
      })
    },
    fail(res){
      console.log(res)
    }
   })
},

// 获取当前时间
gettime(){
  var date = new Date();
  var MM = date.getMonth() + 1
  var DD = date.getDate()
  var TT = date.getHours()
  var MI = date.getMinutes()
  var SS = date.getSeconds()
  var time = `${date.getFullYear()}/${MM < 10 ? '0'+MM : MM}/${DD < 10 ? '0'+DD : DD} ${TT < 10 ? '0'+TT : TT}:${MI < 10 ? '0'+MI : MI}:${SS < 10 ? '0'+SS : SS}`;

  this.setData({
    time:time
  })
},

//上传信息     上传数据点API
async upload_info(){
  var that = this
  var i_hum = that.data.hum[0]
  var i_temper = that.data.temper[0]
  var i_MQ5 = that.data.MQ5[0]
  var i_PM25 = that.data.PM25[0]
  var i_alarm = that.data.alarm
  var i_vent = that.data.vent
  var i_check = that.data.check
  var url = that.data.url
  var APIKey = that.data.APIKey
  let data
    data={
    "datastreams":[
      {"id":"hum","datapoints":[{"value":i_hum}]},
      {"id":"temp","datapoints":[{"value":i_temper}]},
      {"id":"MQ5","datapoints":[{"value":i_MQ5}]},
      {"id":"PM25","datapoints":[{"value":i_PM25}]},
      {"id":"alarm","datapoints":[{"value":i_alarm}]},
      {"id":"vent","datapoints":[{"value":i_vent}]},
      {"id":"check","datapoints":[{"value":i_check}]},
    ]
  }
  wx.request({
    url: `https://api.heclouds.com/devices/${url}/datapoints`,
    header:{
      'content-type':'application/json',
      "api-key":`${APIKey}`
    },
    method:'POST',
    data:JSON.stringify(data),
    fail(e){
    Toast.fail('网络错误，请重试')
  }
  })
},

//上传超限信息     上传数据点API
async upload_alarm_info(){
  var that = this
  var i_hum = that.data.hum[0]
  var i_temper = that.data.temper[0]
  var i_MQ5 = that.data.MQ5[0]
  var i_PM25 = that.data.PM25[0]
  var i_alarm = that.data.alarm
  var i_vent = that.data.vent
  var i_check = that.data.check
  var a_url = that.data.a_url
  var a_APIKey = that.data.a_APIKey
  //var url = that.data.url
  let data
    data={
    "datastreams":[
      {"id":"hum","datapoints":[{"value":i_hum}]},
      {"id":"temp","datapoints":[{"value":i_temper}]},
      {"id":"MQ5","datapoints":[{"value":i_MQ5}]},
      {"id":"PM25","datapoints":[{"value":i_PM25}]},
      {"id":"alarm","datapoints":[{"value":i_alarm}]},
      {"id":"vent","datapoints":[{"value":i_vent}]},
      {"id":"check","datapoints":[{"value":i_check}]},
    ]
  }
  wx.request({
    url: `https://api.heclouds.com/devices/${a_url}/datapoints`,
    header:{
      'content-type':'application/json',
      "api-key":`${a_APIKey}`
    },
    method:'POST',
    data:JSON.stringify(data),
    fail(e){
    Toast.fail('网络错误，请重试')
  }
  })
},

//下发安全值  发布消息API
putdefaultinfo2() {
  var that = this;
  const data = {
    "target":"Stepper",
    "Stepper1" : that.data.Stepper1,
    "Stepper2" : that.data.Stepper2,
    "Stepper3" : that.data.Stepper3,
    "Stepper4" : that.data.Stepper4
  }
  wx.request({
    url: `http://api.heclouds.com/mqtt?topic=${mpPubTopic}`,
    header:{
      'content-type':'application/json',
      "api-key":'iJCP48EDyv5HDHBYxN1Y70O64mY='
    },
    method:'POST',
    data:data,
    success(res){
      console.log(res)
    },fail(e){
      Toast.fail('网络错误，请重试')
    }
  })
  
},

//控制警报器  发布消息API
controll_alarm:function(e){
  var that = this;
  let sw = e.detail.value;
  that.setData({
    flag:1,
    alarm: sw,
  })
  let data
  if (sw) {
    data = {"target":"BEEP","value":1}
  }else{
    data ={"target":"BEEP","value":0}
  }
  wx.request({
    url: `http://api.heclouds.com/mqtt?topic=${mpPubTopic}`,
    header:{
      'content-type':'application/json',
      "api-key":'iJCP48EDyv5HDHBYxN1Y70O64mY='
    },
    method:'POST',
    data:data,
    success(res){
      console.log(res)
    },fail(e){
      Toast.fail('网络错误，请重试')
    }
  })
},

//控制通风机  发布消息API
controll_vent:function(e){
  var that = this;
    console.log(e.detail);
    let sw = e.detail.value;
    var radio = wx.getStorageSync('radio')
    that.setData({
      vent: sw,
      radio: radio,
    })
      
    let data
    if (sw && that.data.radio == 1 ) {
      data = {"target":"vent","value":1}
    }else if (sw && that.data.radio == 2) {
      data ={"target":"vent","value":2}
    } else {
      data ='{"target":"vent","value":0}'
    };
    console.log(data);
   wx.request({
    url: `http://api.heclouds.com/mqtt?topic=${mpPubTopic}`,
    header:{
      'Content-Type':'application/json',
      "api-key":'iJCP48EDyv5HDHBYxN1Y70O64mY='
    },
    method:'POST',
    data:data,
    success(res){
      console.log(res.data.errno)
    },fail(res){
      Toast.fail('网络错误，请重试')
    }
  })
},

//拖动悬浮球
msgchange(e){
  var that = this
  var pageX = e.changedTouches[0].pageX
  var pageY = e.changedTouches[0].pageY
  // console.log(that.data.screenWidth)
  // console.log(that.data.screenWidth-pageX)
  pageX = ( (pageX>(that.data.screenWidth-pageX)) ? that.data.screenWidth : 0)

  that.setData({
    x:pageX,
    y:(pageY-25)

  })

},

tomsg(e){
  var that = this
  that.setData({
    redpoint : false
  })
    try {
      wx.setStorageSync('vent', that.data.vent)
    } catch (e) {
      console.log("跳转错误")
    }
    finally{ 
        wx.navigateTo({
    url: '/pages/msg/msg',
  })
  }

},

totemperPage(e){
  wx.navigateTo({
    url: '/pages/temper/temper',
  })
},

tohumPage(e){
  wx.navigateTo({
    url: '/pages/hum/hum',
  })
},

toMQ5Page(e){
  wx.navigateTo({
    url: '/pages/MQ5/MQ5',
  })
},

toPM25Page(e){
  wx.navigateTo({
    url: '/pages/PM25/PM25',
  })
},

toventPage(e){
  wx.navigateTo({
    url: '/pages/vent/vent',
  })
},

toalarmPage(e){
  wx.navigateTo({
    url: '/pages/alarm/alarm',
  })
},
}
);
