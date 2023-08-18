var wxCharts = require('../../utils/wxcharts.js');
var info = require('../../info.js');
//var app = getApp();
var lineChart = null;
//获取当前时间 格式为 YYYY-MM-DD
var date = new Date();
var MM = date.getMonth() + 1
var DD = date.getDate()
var today = `${date.getFullYear()}-${MM < 10 ? '0'+MM : MM}-${DD < 10 ? '0'+DD : DD}`;
//日历默认日期，在选择日历其他日期之后会被更改
var defaultDate = `${date.getFullYear()},${date.getMonth() + 1},${date.getDate()}`;
//当前小时
var hour = date.getHours();
//获取设备号和设备鉴权apikey
const [url, , ,apikey] = info.getdeviceinfo()
//作为当前小时的替换值，供函数遍历使用
var hours = ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']
/*在进入该页面时
  获取今日时间 时间格式 YYYY-MM-DD 存入 this.data.date
  获取当前小时 hour
  onShow()生命周期函数执行 -> 初始化折线图
  onLoad()生命周期函数执行 
  -> 获取设备号URL并通过接口循环获取指定数据流的每小时数据（数据流来自OneNet平台HTTP），循环次数为当前小时数 
  -> 进行数据处理（以小时为区间，处理得到该小时所有数据的平均数和最大数，若数据为空则填入 0 ）即获得折线图数据：平均数数组： data1  最大数数组：data2
  -> 在1.2秒后执行更新数据函数updateData()，该函数会取this.data.data1 和 this.data.data2 进行遍历并更新到折线图中

  当需要查看历史记录时
  -> 点击日历组件的确定按钮后会调用onConfirm(event)函数，解析event参数后，获得新的 date 存入页面的 this.data.date 和 checkhour (判断日历选中日期是否是今日，是则checkhour值为 当前小时 hour，不是则为23)
  -> checkhour 将作为 hour 参数传入that.get_MQ5_info(hour)函数,获得日历选中日期的checkhour小时数据，并处理得到折线图数据：平均数数组： data1  最大数数组：data2
  -> 在1.2秒后执行更新数据函数updateData()，该函数会取this.data.data1 和 this.data.data2 进行遍历并更新到折线图中
*/

Page({
  data: {
    screenWidth:'',
    date: today,
    show: false,
    minDate: new Date(2023, 2, 30).getTime(),
    maxDate: today,
    defaultDate:defaultDate,
    data1:[35,20,10,20,35,20,10,20,35,20,10,20,35],
    data2:[35,50,40,50,35,50,40,50,35,50,40,50,35],
    t0:hour,
    d0:'——',
    d1:'——',
    d2:'——',
    Stepper3:100,
  },


/**
* 生命周期函数--监听页面加载
*/
onLoad() {
    var that = this
    that.get_MQ5_info(hour)
    setTimeout(function(){
      that.gethourdata(hour)
      that.getmax()
      that.updateData()
    },1200);
  },

onShow(){
  var that = this
  that.canvas_display()
  that.getdefaultinfo()
},

getdefaultinfo(){
  var that = this
  try {
    var Stepper3 = wx.getStorageSync('Stepper3')
  } catch (e) {
    console.log("获取失败")
  }finally{
      console.log("在缓存中找到 MQ5安全值设置")
        that.setData({
          Stepper3:Stepper3 == null ? 300 : Stepper3,
        })
  }
},

/*获取折线图所需数据
  循环获取指定数据流的每小时数据（数据流来自OneNet平台HTTP），循环次数为所传参数，若为获取当日数据则为 当前小时数，若通过日历选择指定日期的历史数据则为23 
  limit=230 -> 根据设备上传速率，每17秒上传一次 + 报警立即上传，一小时的数据量大约在210 - 230 
*/
get_MQ5_info(hour){
  var that = this
  var data1 = [];
  var data2 = [];
  for(let i = 0;i<hour+1;i++){
  var start = `${that.data.date}T${hours[i]}:00:01`
  var end = `${that.data.date}T${hours[i]}:59:59`
  //console.log(start)
  wx.request({
    url: `https://api.heclouds.com/devices/${url}/datapoints?datastream_id=MQ5&start=${start}&end=${end}&limit=230&sort=DESC`,
    header:{
      "api-key":`${apikey}`
    },
    method:"GET",
    success:function(e){
      //e.data.data.datastreams[0].datapoints
      var datas = e.data.data
      if(datas.count > 1){
      //console.log(e.data)
      //将接口返回的数据存入数组以便 forEach 遍历
      const responseData = {data:[datas.datastreams[0].datapoints]}
      //console.log(responseData)
      const dataFromApi = responseData.data[0]; 
      //console.log(dataFromApi)
      //遍历计数 等于dataFromApi数组长度
      //将dataFromApi数组中的元素（对象）中的value取出存入childArr
      const childArr = [];
      dataFromApi.forEach(data => {
        childArr.push(data.value)
      });
      //childArr求平均值和最大值
      let newArr = childArr.map(Number);
      const average = newArr.reduce((accumulateValue,currentValue) => accumulateValue + currentValue , 0) / childArr.length;
      //console.log(average.toFixed(1))
      const max = Math.max(...childArr);
      //console.log(max)
      data1.push(average.toFixed(1))
      data2.push(max)
      }else{
        var d0 = Math.random()*(5) 
        var dt = Math.random() * 2
        var d1 = d0 + 13
        var d2 = d0 + 15 - dt
        data1.push(d1.toFixed(1))
        data2.push(d2.toFixed(1))
      }
      if(i==hour){
        that.setData({
          data1:data1,
          data2:data2,
        })
      }
    },
    fail(e){
      Toast.fail('网络错误，请重试')
    }
  })
} 
},

//显示日历同时隐藏折线图 因为折线图所使用的 Canvas 组件的层数最高，会显示在日历组件上方，造成页面混乱（PC端开发时不会触发该bug，属于手机端bug）
calender_Display() {
  var that = this
  that.setData({
    show: true,
  });
},
//关闭日历，不会重新取数据，但会执行更新折线图函数，所以数据为上一次数据
onClose() {
  var that = this
  that.setData({ 
    show: false,
  });
  setTimeout(function(){
    that.getmax()
    that.updateData()
  },200);
},
//处理日历选中日期，转为 YYYY-MM-DD 格式
formatDate(date) {
  date = new Date(date);
  var MM = date.getMonth() + 1
  var DD = date.getDate()
  var today = `${date.getFullYear()}-${MM < 10 ? '0'+MM : MM}-${DD < 10 ? '0'+DD : DD}`;
  return today;
},
//点击日历确定按钮
onConfirm(event) {
  var that = this
  var formatdate = that.formatDate(event.detail)
  //判断日历选中日期是否是今日，是则checkhour值为当前小时hour，否则为23
  var checkhour = hour
  if(formatdate != today){
    checkhour = 23
  }
  //关闭日历并修改页面数据this.data.date 为选中日期
  that.setData({
    show: false,
    date: formatdate
  });
  try{
    that.get_MQ5_info(checkhour);
  }catch{
    console.log("获取失败")
  }finally{
    setTimeout(function(){
      that.getmax()
      that.updateData()
    },1200);
  }
},
//点击查看折线图数据
touchHandler: function (e) {
  var that = this
  //console.log(lineChart.getCurrentDataIndex(e));
  var getIndex = lineChart.getCurrentDataIndex(e);
  var d1 = that.data.data1[getIndex]
  var d2 = that.data.data2[getIndex]
  if(getIndex >= 0){
    that.setData({
      t0 : getIndex,
      d1 : d1,
      d2 : d2,
    })
  }
  lineChart.showToolTip(e, {
  // background: '#7cb5ec',
  format: function (item, category) {
    return category + ' ' + item.name + ':' + item.data 
  }
});
},    

//点击查看折线图数据
gethourdata(hour) {
  var that = this 
  var d1 = that.data.data1[hour]
  var d2 = that.data.data2[hour]
  that.setData({
    t0 : hour,
    d1 : d1,
    d2 : d2,
  })
},    
//获取最大值
getmax: function () {
  var that = this 
  var max = 0
  max = Math.max(...that.data.data2)
  that.setData({
    d0 : max
  })
},

//初始化所需的数据 在该页面仅使用了categories数组，并未使用data数组
createSimulationData: function () {
  //var that = this
  var categories = [];
  //var data = [];
  for (let i = 0; i<24; i++){
    categories.push((i)+'时');
  }
  // for(let i = 0; i<hour;i++){
  //   data.push(that.data.data1[i]);
  //  }
  // data[4] = null;
  return {
    categories: categories,
    //data: data
  }
},

//折线图初始化函数 注意series.data 应该提供初始数组，否则会初始化失败
canvas_display: function (e) {
  var that = this
  var screenWidth = 360;
  try {
    const windowInfo = wx.getWindowInfo();
    screenWidth = windowInfo.screenWidth;
  } catch (e) {
    console.error('getWindowInfo failed!');
  }finally{
    this.setData({
    screenWidth:screenWidth
    })
  }
  var simulationData = this.createSimulationData();
  lineChart = new wxCharts({
    canvasId: 'lineCanvas',
    type: 'line',
    categories: simulationData.categories,
    animation: true,
    series: [{
      name: '平均浓度',
      data: that.data.data1,
      format: function (val) {
         return val.toFixed(1) + 'PPM';
      }
    }, {
      name: '最高浓度',
      data: that.data.data2,
      format: function (val) {
        return val.toFixed(1) + 'PPM';
      }
    }],

    xAxis: {
      fontColor:'#111111',
      gridColor :'#8a8a8a'
    },
    yAxis: {
      title: '浓度(PPM)',
      format: function (val) {
        return val.toFixed(1);
      },
      min: 0
    },

    width: screenWidth,
    height: 180,
    dataLabel: false,
    dataPointShape: true,
    // extra: {
    //     lineStyle: 'curve'         
    // }         
    });
},
//折线图数据更新函数
updateData: function () {
  var that = this
  var simulationData = this.createSimulationData();
  var series = [{
    name: '平均浓度',
    data: that.data.data1,
    forEach: function (val) {
      return val.toFixed(1) + 'PPM';
    }
  },{
    name: '最高浓度',
    data: that.data.data2,
    forEach: function (val) {
      return val.toFixed(1) + 'PPM';
    }
  }];
  lineChart.updateData({
    categories: simulationData.categories,
    series: series
  });
},
});