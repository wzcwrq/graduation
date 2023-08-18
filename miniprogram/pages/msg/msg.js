const info = require('../../info.js');
var app = getApp()
const apikey = info.getapikey()

Page({
  data: {
    url:'',
    attime : [],
    temper : '',
    hum : '',
    MQ5 : '',
    PM25 : '',
    alarm :1,
    vent :1,
    check:1,
    activeName0: '0',
    activeName: '1',
    childArr: [
      {
        id:'1',
        time:'',
        temper : '',
        hum : '',
        MQ5 : '',
        PM25 : '',
        alarm :1,
        vent :1,
    },
    ],
  },

  onLoad() {
    var that = this;
    that.geturl();
    //that.getinfo();
    that.get_alarm_info();
  },
  

geturl(){
  var that = this
  const [url,screenWidth,windowHeight] = info.getdeviceinfo()
  that.setData({
    url:url,
    screenWidth:screenWidth,
    windowHeight:windowHeight,
    y:0.8*windowHeight
  })
},


// 获取设备实时信息
// getinfo(){
//   var that = this
//   var url = that.data.url
//   //const color="#d81e06"
//   wx.request({
//     url: `https://api.heclouds.com/devices/${url}/datapoints`,
//     header:{
//       "api-key":`${apikey}`
//     },
//     method:"GET",
//     success:function(e){
//       var datas = e.data.data
//       console.log(datas)
//          that.setData({
//           hum:[datas.datastreams[1].datapoints[0].value,datas.datastreams[0].datapoints[0].value >= 60 ?'#d81e06':'#222222'],
//           temper:[datas.datastreams[3].datapoints[0].value,datas.datastreams[2].datapoints[0].value >= 30 ?'#d81e06':'#222222'],
//           PM25:[datas.datastreams[4].datapoints[0].value,datas.datastreams[3].datapoints[0].value >= 150 ?'#d81e06':'#222222'],
//           MQ5:[datas.datastreams[0].datapoints[0].value,datas.datastreams[4].datapoints[0].value >= 300 ?'#d81e06':'#222222'],
//           alarm:datas.datastreams[5].datapoints[0].value,
//           vent:datas.datastreams[2].datapoints[0].value,
//           check:datas.datastreams[6].datapoints[0].value,
//       })
//     },
//     fail(e){
//       Toast.fail('网络错误，请重试')
//     }
//   })
// },

// 获取设备警报信息
get_alarm_info(){
  var that = this
  var url = that.data.url
  //const color="#d81e06"
  wx.request({
    // url: `https://api.heclouds.com/devices/${url}/datapoints?start=2023-03-30T03:10:00&limit=5000&sort=DESC`,
    // header:{
    //   "api-key":`${apikey}`
    // },
    url: `https://api.heclouds.com/devices/1064411779/datapoints?start=2023-05-01T15:40:00&limit=3000&sort=DESC`,
    header:{
      "api-key":`PNQQrh5QHNxQXbpFSwNsNCbVv=g=`
    },
    method:"GET",
    success:function(e){
      var datas = e.data.data
      console.log(datas)
      //将接口返回的数据存入数组以便 forEach 遍历
      const responseData = {data:[datas.datastreams[6].datapoints]}
      const dataFromApi = responseData.data[0]; 

      let lastAddedTime;
      //遍历计数 等于dataFromApi数组长度
      var i = 0;
      //计数 <6
      var j = 1;
      const childArr = [];
      dataFromApi.forEach(data => {
        var res = data.value
        if(res == 1 && j < 11){
          const timestamp = Date.parse(data.at)
          const timeat = data.at.substring(0,19)
          if(!lastAddedTime || lastAddedTime - timestamp >= 1*60*1000){
            // console.log(timestamp)
            lastAddedTime = timestamp
            childArr.push({
              id:j,
              time:timeat,
              temper:datas.datastreams[3].datapoints[i].value,
              hum:datas.datastreams[1].datapoints[i].value,
              PM25:datas.datastreams[4].datapoints[i].value,
              MQ5:datas.datastreams[0].datapoints[i].value,
              alarm:datas.datastreams[5].datapoints[i].value,
              vent:datas.datastreams[2].datapoints[i].value,
            })
            j++;
          }
        }
        i++;
        
      });
      // console.log(childArr)
      that.setData({
        childArr:childArr
      })
            // that.setData({
            //   hum:datas.datastreams[1].datapoints[i].value,
            //   temper:datas.datastreams[3].datapoints[i].value,
            //   PM25:datas.datastreams[4].datapoints[i].value,
            //   MQ5:datas.datastreams[0].datapoints[i].value,
            //   alarm:datas.datastreams[5].datapoints[i].value,
            //   vent:datas.datastreams[2].datapoints[i].value,
            // })
    },
    fail(e){
      Toast.fail('网络错误，请重试')
    }
  })
},


onChange0(event) {
  this.setData({
    activeName0: event.detail,
  });
},

onChange(event) {
  this.setData({
    activeName: event.detail,
  });
},



  // async getfromcloud(url){
  //   const res = await app.call({
  //     path:`/api/user/?url=${url}`,
  //     method:'GET',
  //   })
  //   return res.data
  // },


  // async finallylogin(e){
  //   var that = this

  //   const msginfo = await that.getfromcloud(that.data.url) 
  //   console.log(msginfo)
  //     that.setData({
  //       attime : msginfo.attime,
  //       temper : msginfo.temper,
  //       hum : msginfo.hum,
  //       MQ5 : msginfo.MQ5,
  //       PM25 : msginfo.PM25,
  //       alarm :msginfo.alarm,
  //       vent :msginfo.vent,
  //     })
  // },
})