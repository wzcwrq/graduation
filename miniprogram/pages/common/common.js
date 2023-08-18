// pages/common/common.js
Page({
  data: {
    show: false,
    overlay:true,
    actions: [
      {
        name: '允许',
      },
      {
        name: '禁止',
      }
    ],
  },

  onLoad(options) {

  },
  onclick(){
    this.setData({ show: true });
  },
  onClose() {
    this.setData({ show: false });
  },

  onSelect(event) {
    console.log(event.detail);
  },

//该请求只做演示，具体功能请查询开发者文档
  sendreq(){
    wx.requestSubscribeMessage({
      tmplIds: ['uuBTeg93ypvxMPJ0nrLP9Vd58rhN401OsmQdaqxmJIo'],
      success (res) {
        console.log(res)
        // res包含模板id，值包括'accept'、'reject'、'ban'、'filter'。
        // 'accept'表示用户同意订阅该条id对应的模板消息
        // 'reject'表示用户拒绝订阅该条id对应的模板消息
        // 'ban'表示已被后台封禁
        // 'filter'表示该模板因为模板标题同名被后台过滤。
      }
    })
  },
  

});

