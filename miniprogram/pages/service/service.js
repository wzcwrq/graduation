import { areaList } from '@vant/area-data';
import Toast from '@vant/weapp/toast/toast';
// var info = require('../../info.js');
// const app = getApp()
const db = wx.cloud.database({
  env: 'userinfo-7g22uj334d44b764'
})
const collection = db.collection('user')

const deviceSubTopic = "/yunyao/sub"; //  设备订阅topic（小程序发布命令topic）
const devicePubTopic = "/yunyao/pub"; //  设备发布topic（小程序订阅数据topic）
const mpSubTopic = devicePubTopic;
const mpPubTopic = deviceSubTopic;

Page({
  data: {
    showarea : false,   
    showurl:false, 
    showedit:true,
    url:'',
    phonenumber:'',
    temp_url:'',
    areaList,
    area:'',
    phone:['',''],

    switchTitle1: ' 温 度',
    switchTitle2: ' 湿 度',
    switchTitle3: ' 可燃气体',
    switchTitle4: ' PM2.5',
    switch1:true,
    switch2:true,
    switch3:true,
    switch4:true,
    Stepper:false,
    Stepper1:30,
    Stepper2:80,
    Stepper3:100,
    Stepper4:100,
    value1: 0,

    contracts:[],
  },


onLoad() {
  var that = this
  that.getuserinfo()
  that.getphoneinfo()
  that.getURL()
},


//获取缓存数据
getuserinfo(){
  var that = this
  try {
    var geturl = wx.getStorageSync('url')
    var getphonenumber = wx.getStorageSync('phonenumber')
    var getarea = wx.getStorageSync('area')
    var switch1 = wx.getStorageSync('switch1')
    var switch2 = wx.getStorageSync('switch2')
    var switch3 = wx.getStorageSync('switch3')
    var switch4 = wx.getStorageSync('switch4')
    var Stepper1 = wx.getStorageSync('Stepper1')
    var Stepper2 = wx.getStorageSync('Stepper2')
    var Stepper3 = wx.getStorageSync('Stepper3')
    var Stepper4 = wx.getStorageSync('Stepper4')
  } catch (e) { 
    Toast.fail('网络错误，请检查网络设置');
  }
  finally{
    if(switch1 == null || switch4 == null || Stepper1 == null || Stepper4 == null){
      console.log("缓存中未找到用户设置，启用初始化设置")
    }else{
      that.setData({
      url:geturl,
      phonenumber:getphonenumber,
      area:getarea,
      switch1:switch1,
      switch2:switch2,
      switch3:switch3,
      switch4:switch4,
      Stepper1:Stepper1,
      Stepper2:Stepper2,
      Stepper3:Stepper3,
      Stepper4:Stepper4,
    })
    }
    
  }
},

    /**
   * 生命周期函数--监听页面隐藏
   * 将 4 个开关 和 4 个 步进器 的数据存入缓存
   */
  onHide() {
    var that = this
    try {
      wx.setStorageSync('switch1', that.data.switch1)
      wx.setStorageSync('switch2', that.data.switch2)
      wx.setStorageSync('switch3', that.data.switch3)
      wx.setStorageSync('switch4', that.data.switch4)
      wx.setStorageSync('Stepper', that.data.Stepper)
      wx.setStorageSync('Stepper1', that.data.Stepper1)
      wx.setStorageSync('Stepper2', that.data.Stepper2)
      wx.setStorageSync('Stepper3', that.data.Stepper3)
      wx.setStorageSync('Stepper4', that.data.Stepper4)
    } catch (e) { 
    }
    finally{ 
  }
  },


//获取手机屏幕长宽
getphoneinfo(){
const windowInfo = wx.getWindowInfo();
var that = this
console.log(windowInfo.windowHeight)
  that.setData({
    phone:[windowInfo.screenWidth,windowInfo.windowHeight]
  })
},

//超限通知
onConfirm() {
  this.selectComponent('#item').toggle();
  var that = this
    try {
      wx.setStorageSync('switch1', that.data.switch1)
      wx.setStorageSync('switch2', that.data.switch2)
      wx.setStorageSync('switch3', that.data.switch3)
      wx.setStorageSync('switch4', that.data.switch4)
      wx.setStorageSync('Stepper', true)
    } catch (e) { 
      wx.showToast({
        icon:"error",
        title: "保存失败 0_X ",
        duration: 1000,
      });
    }
    finally{ 
      wx.showToast({
        title: "保存成功~ ",
        duration: 1000,
      });
  }
},
//开关1 温度
onSwitch1Change({ detail }) {
  this.setData({ 
    switch1: detail,
    Stepper: true
  });
},
//开关2 湿度
onSwitch2Change({ detail }) {
  this.setData({ 
    switch2: detail,
    Stepper: true
  });
},
//开关3 MQ5
onSwitch3Change({ detail }) {
  this.setData({
     switch3: detail,
     Stepper: true
    });
},
//开关4 PM2.5
onSwitch4Change({ detail }) {
  this.setData({ 
    switch4: detail,
    Stepper: true
   });
},


//下发安全值
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

//安全值设置
onConfirm0() {
  var that = this
  that.selectComponent('#Stepper').toggle();
  console.log("进入安全值设置")
    try {
      wx.setStorageSync('Stepper1', that.data.Stepper1)
      wx.setStorageSync('Stepper2', that.data.Stepper2)
      wx.setStorageSync('Stepper3', that.data.Stepper3)
      wx.setStorageSync('Stepper4', that.data.Stepper4)
      wx.setStorageSync('Stepper', true)
    } catch (e) { 
      //console.log("保存失败")
      wx.showToast({
        icon:"error",
        title: "保存失败 0_X ",
        duration: 1000,
      });
    }
    finally{ 
      //console.log("保存成功")
      that.putdefaultinfo2()
      wx.showToast({
        title: "保存成功~ ",
        duration: 1000,
      });
  }
},
usedefault(){
  var that = this
  that.setData({ 
    Stepper: true,
    Stepper1: 30 ,
    Stepper2: 80 ,
    Stepper3: 100 ,
    Stepper4: 100 ,
  });
},
//步进器1 温度
onStepper1(event) {
  //console.log(event.detail);
  this.setData({ 
    Stepper1: event.detail,
    Stepper: true
  });
},
//步进器2 湿度
onStepper2(event) {
  //console.log(event.detail);
  this.setData({
     Stepper2: event.detail,
     Stepper: true
     });
},
//步进器3 MQ5
onStepper3(event) {
  //console.log(event.detail);
  this.setData({
     Stepper3: event.detail,
     Stepper: true
    });
},
//步进器4 PM2.5
onStepper4(event) {
  //console.log(event.detail);
  this.setData({ 
    Stepper4: event.detail,
    Stepper: true
  });
},
//点击 我的设备号 该组件 显示弹出层
onclickurl(){
  this.setData({
    showurl : true
  })
},
//点击遮罩层关闭弹出层
onCloseurl(){
  this.setData({
    showurl : false,
    showedit:true
  })
},
//点击 我的设备号 该组件 显示弹出层   但是没使用到。。。
onsure(e){
  var that = this
  that.setData({
    showurl:false,
    url:e.detail.value,
    showedit:true
  })
},
//点击修改按钮，显示输入框
onedit(e){
  var that = this
  that.setData({
    showedit:false,
    url:e.detail.url
  })
},
//点击修改按钮时展示输入框默认内容
oninput(e){
  var that = this
  that.setData({
    temp_url:e.detail
  })
},
//输入框失去聚焦
onblur(e){
  var that = this
  var temp_url = e.detail.value
  that.setData({
    temp_url:temp_url
  })
  that.updateURL(temp_url)
},

//保存url
updateURL(temp_url){
  var that = this
  const _ = db.command
  try {
      collection.where({
      phonenumber: that.data.phonenumber
    })
    .update({
      data: {
        url: _.set(temp_url)
      },
    })
  } catch(e) {
    console.error(e)
  }finally{
    try{
      wx.setStorageSync('url', temp_url)
    }catch{
    }
  }
},



//添加设备url
onbotton(e){
  var that = this
  that.setData({
    showedit:true,
    showurl : false,
    url:that.data.temp_url
  })
  try{
    that.updateURL(that.data.temp_url)
  }catch{
    wx.showToast({
      title:"修改失败 0_X",
      icon:"error",
      duration: 600,
    })
  }finally{
    wx.showToast({
      title:"修改成功",
      duration: 600,
    })
  }
},

onclickarea(){
  this.setData({
    showarea : true
  })
},

onClosearea(){
  this.setData({
    showarea : false
  })
},

//设备所在地
onfinish(event){
  var that = this
  var area = event.detail.values[0].name+event.detail.values[1].name+event.detail.values[2].name
  that.setData({
    showarea : false,
    area : area,
  })
  try {
    that.updatearea(area)
  } catch (e) { 
    wx.showToast({
      icon:"error",
      title: "添加失败 0_X ",
      duration: 600,
    });
  }
},

updatearea(area){
  var that = this
  const _ = db.command
  try {
      collection.where({
      phonenumber: that.data.phonenumber
    })
    .update({
      data: {
        area: _.set(area)
      },
    })
  } catch(e) {
    console.error(e)
  }finally{
    try{
      wx.setStorageSync('area', area)
    }catch{
    }
  }
},

getURL(){
  var that = this
  collection.where({
    url : that.data.url
  }).get({
    success:function(res){
      // console.log(res.data)
      const datas = res.data
      const contracts = [];
      datas.forEach(data => {
        if(data.phonenumber!=that.data.phonenumber){
           contracts.push(data.phonenumber)
        }
      });
      // console.log(contracts)
      that.setData({
        contracts:contracts
      })
    }
  })
},

});

