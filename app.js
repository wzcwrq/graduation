// app.js
//配置环境需要修改这个文件，但是我不知道具体被我改了哪里了
App({
  onLaunch: 
  async function () {
      wx.cloud.init({env: 'userinfo-7g22uj334d44b764'});
      // const res = await wx.cloud.callContainer({
      //   "config": {
      //     "env": "prod-5gtcv8rz85758c60"
      //   },
      //   "path": "/api/count",
      //   "header": {
      //     "X-WX-SERVICE": "springboot-8nrm"
      //   },
      // })
    //console.log(res);
    this.globalData = {};
  },


  async call(obj, number=0){
    const that = this
    if(that.cloud == null){
      that.cloud = new wx.cloud.Cloud({
        resourceAppid: 'wxb1213d7ea004c404', // 微信云托管环境所属账号，服务商appid、公众号或小程序appid
        resourceEnv: 'prod-5gtcv8rz85758c60', // 微信云托管的环境ID
      })
      await that.cloud.init() // init过程是异步的，需要等待 init 完成才可以发起调用
    }
    try{
      const result = await that.cloud.callContainer({
        path: obj.path, // 填入业务自定义路径和参数，根目录，就是 / 
        method: obj.method||'GET', // 按照自己的业务开发，选择对应的方法
        // dataType:'text', // 如果返回的不是 json 格式，需要添加此项
        header: {
          "X-WX-SERVICE": "springboot-8nrm", // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
          // 其他 header 参数
        }
        // 其余参数同 wx.request
      })
      console.log(`微信云托管调用结果${result.errMsg} | callid:${result.callID}`)
      return result.data // 业务数据在 data 中
    } catch(e){
      const error = e.toString()
       // 如果错误信息为未初始化，则等待300ms再次尝试，因为 init 过程是异步的
      if(error.indexOf("Cloud API isn't enabled")!=-1 && number<3){
        return new Promise((resolve)=>{
          setTimeout(function(){
            resolve(that.call(obj,number+1))
          },300)
        })
      } else {
        throw new Error(`微信云托管调用失败${error}`)
      }
    }
  }














});



