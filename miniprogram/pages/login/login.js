var userlogin = require('../../userlogin.js');
const db = wx.cloud.database({
  env: 'userinfo-7g22uj334d44b764'     //云环境ID
})

Page({
  data: {
    storage:['','','',''],
    truecolor:'#06bd60',
    errorcolor:'#bd2806',
    password:'',
    phonenumber:['',''],
    showcounttime:true,
    show:['password','text'],
    icon:['closed-eye','eye-o'],
    count:0,
  },

 
getData(){
    var that = this
    var p = that.data.phonenumber[0]
    const collection = db.collection('user')
    collection.where({
      phonenumber : p
    }).get({
      success:function(res){
        that.setData({
          c_account:res.data[0].account,
          c_phonenumber: res.data[0].phonenumber,
          c_password : res.data[0].password,
          c_url:res.data[0].url,
          c_username:res.data[0].username
        })
      }
    })

    if(that.data.c_url){
      const collection2 = db.collection('device');
      collection2.where({
        url : that.data.c_url
      }).get({
        success:function(res){
          const datas = res.data[0]
          console.log(datas.APIKey)
          that.setData({
            APIKey:datas.APIKey,
            a_APIKey:datas.a_APIKey,
            a_url:datas.a_url
          })
        }
      })
    }
  },

  login(){
    var that = this
    wx.showToast({
      title: "登录中...",
      icon: "loading",
      duration: 4000,
      mask: true,
    });
    that.getData()
    if(that.data.phonenumber[0]==that.data.c_phonenumber && that.data.password== that.data.c_password){
      try{
        wx.setStorageSync('phonenumber',that.data.c_phonenumber)
        wx.setStorageSync('password',that.data.c_password)
        wx.setStorageSync('account', that.data.c_account)
        wx.setStorageSync('username', that.data.c_username)
        wx.setStorageSync('url', that.data.c_url)
        wx.setStorageSync('a_url', that.data.a_url)
        wx.setStorageSync('a_APIKey', that.data.a_APIKey)
        wx.setStorageSync('APIKey', that.data.APIKey)
      }catch(e){
      }finally{
        wx.switchTab({
        url: '/pages/index/index'
      })
      }
    }
    else{
      if(that.data.count == 3){
        that.setData({
          count:2
        })
        wx.showToast({
          title: "失败次数过多",
          icon: "error",
          mask: true,
        });
      }else{
        that.data.count +=1
        wx.showToast({
          title: "登录失败",
          icon: "error",
          mask: true,
        });
      }
    }
  },


  async onLoad() {
    var that = this
    that.getuserregisterinfo()

  },
//当用户注册成功之后，就会将个人信息存在缓存之中
//当使用同一个微信登录时，就会查询缓存中的个人信息用于登录
  getuserregisterinfo(){
    var that = this
    try {
      var account = wx.getStorageSync('account')
      var phonenumber = wx.getStorageSync('phonenumber')
      var password = wx.getStorageSync('password')
      var url = wx.getStorageSync('url')
    } catch (e) {
      console.log("获取失败")
    }finally{
      if(phonenumber != ''){
        console.log("在缓存中找到用户信息")
        that.setData({
        storage:[account,phonenumber,password,url],
        phonenumber:[phonenumber,'']
      })
      }
    
    }
  },

  // 点击密码左端切换（可视按钮）和（不可视按钮）
  onclick_icon(){
    var that = this
    this.setData({
      show:[that.data.show[1],that.data.show[0]],
      icon:[that.data.icon[1],that.data.icon[0]]
    })
  },

// 检查手机号码
  on_check_phonenumber(event){
    var that = this
    if(userlogin.checkPhone(event.detail.value)){
        this.setData({
          phonenumber:[event.detail.value,'']
        })  
    }else {
        this.setData({
          phonenumber:[event.detail.value,'手机号码格式错误']
        })
    }
  },

// 密码
  on_check_password(event){
    var that = this
    that.setData({
      password:event.detail.value
    })
    
  },

  send(){
    var that = this
    if(that.data.showcounttime){
      // 倒计时控制
      const countDown = this.selectComponent('.control-count-down');
      countDown.start();
      this.setData({
        showcounttime:false,
    })
    }
  },

  countdownfinish(){
    var that = this
    that.setData({
      count:0,
      showcounttime:true,
    })
  },

  async finallylogin(e){
    var that = this
    const userinfo = await that.getfromcloud(that.data.phonenumber[0]) 
    console.log(userinfo)
    if(that.data.phonenumber[0]==userinfo.phonenumber && that.data.password== userinfo.password){
      try{
        wx.setStorageSync('phonenumber',userinfo.phonenumber)
        wx.setStorageSync('password',userinfo.password)
        wx.setStorageSync('account',userinfo.account)
        wx.setStorageSync('url', userinfo.url)
      }catch(e){

      }
      if(!userinfo.url){
          wx.switchTab({
          url: '/pages/service/service'  
          })
      }else{
        wx.switchTab({
        url: '/pages/index/index'
      })
      }
      
    }
    else{
      if(that.data.count == 4){
        that.setData({
          count:3
        })
        wx.showToast({
          title: "登录失败",
          icon: "error",
          mask: true,
        });
      }else{
        that.data.count +=1
        wx.showToast({
          title: "登录失败",
          icon: "error",
          mask: true,
        });
      }
      
    }
  },

  goregister(){
    wx.redirectTo({
      url: '/pages/register/register'
    })
  },
})