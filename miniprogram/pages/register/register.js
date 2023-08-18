import Toast from '@vant/weapp/toast/toast';
var userlogin = require('../../userlogin.js');
var random = (Math.random() +1 ) * 101010 + 145671
var account = Math.ceil(random)
const db = wx.cloud.database({
  env: 'userinfo-7g22uj334d44b764'
})
const collection = db.collection('user')
var date = new Date();
var MM = date.getMonth() + 1
var DD = date.getDate()
var TT = date.getHours()
var MI = date.getMinutes()
var SS = date.getSeconds()
var time = `${date.getFullYear()}/${MM < 10 ? '0'+MM : MM}/${DD < 10 ? '0'+DD : DD} ${TT < 10 ? '0'+TT : TT}:${MI < 10 ? '0'+MI : MI}:${SS < 10 ? '0'+SS : SS}`;
Page({
  data: {
    test:'0000',
    truecolor:'#06bd60',
    errorcolor:'#bd2806',
    username:['',0,'',''],
    password:['',0,'',''],
    tpassword:['',0,'',''],
    phonenumber:['',0,'',''],
   // sms:['',0,'',''],
    url:['',0,'',''],
    account:account,
    
    
    show:['password','text'],
    icon:['closed-eye','eye-o'],
    showcounttime:true,
    countdown: 1 * 1 * 3 * 1000,

    value: 0,
    gradientColor: {
      '0%': '#63b9e7',
      '25':'#092b9f',
      '50':'#f4ce0e',
      '75':'#ddf427',
      '100%': '#f04e04',
    },
  },

  onLoad() {
    
  },


  addUser(){
    var that = this
    if(that.data.value!=100){
      wx.showToast({
        title: "请填写信息",
        icon:"error"
      });
    }else{
      var p = that.data.phonenumber[0]
    collection.where({
      phonenumber : p
    }).get({
      success:function(res){
        if(res.data.length === 0){
          collection.add({
            data:{
                account:that.data.account,
                username:that.data.username[0],
                phonenumber : that.data.phonenumber[0],
                password : that.data.password[0],
                url : that.data.url[0],
                time:time,
                area:440105,
            },
            success:function(res){
              try{
                wx.setStorageSync('account', that.data.account)
                wx.setStorageSync('phonenumber',that.data.phonenumber[0])
                wx.setStorageSync('password',that.data.password[0])
                wx.setStorageSync('username', that.data.username[0])
                wx.setStorageSync('url', that.data.url[0])
              }catch(e){
              }finally{
                wx.showToast({
                  title: "注册成功",
                  mask: true,
                },1200);
                wx.navigateBack({
                  url: '/pages/login/login',
              })
              }
            }
          })
        }else{
          wx.showToast({
            title: "手机号已被注册",
            icon:"error",
            mask: true,
          });
        }
        }
    })
    }
  },


  onclick_icon(){
    var that = this
    that.setData({
      show:[that.data.show[1],that.data.show[0]],
      icon:[that.data.icon[1],that.data.icon[0]]
    })
  },
  on_check_username(event){
    var that = this
    if( event.detail.value.length <= 6 && event.detail.value.length>=2){
      if(that.data.username[1]==0){
        that.setData({
        value: that.data.value + 25,
      })
      }
      that.setData({
        username:[event.detail.value,25,that.data.truecolor,'']
      })  

    }else{
      if(that.data.username[1]==25){
        that.setData({
          value: that.data.value - 25 
      })
      }
        that.setData({
          username:[event.detail.value,0,that.data.errorcolor,"请输入字符长度为2-6的用户名"]
        })
    }
  },

  on_check_phonenumber(event){
    var that = this
    if(userlogin.checkPhone(event.detail.value)){
      if(that.data.phonenumber[1]==0){
        that.setData({
          value: that.data.value+25,
        })
      }
        that.setData({
          phonenumber:[event.detail.value,25,that.data.truecolor,'']
        })  
    }else{
      if(that.data.phonenumber[1]==25){
        that.setData({
          value: that.data.value - 25 
      })
      }
      that.setData({
          phonenumber:[event.detail.value,0,that.data.errorcolor,"请输入正确的手机号码"]
        })
    }
  },

/* checkSms
  on_check_sms(event){
    var that = this
    if(event.detail.value == this.data.test){
      if( that.data.sms[1]==0){
        this.setData({
          value:that.data.value + 25
        })
      }
      this.setData({
        sms:[event.detail.value,25,that.data.truecolor,''],
      })
    }else{
      if(that.data.sms[1]==25){
        this.setData({
          value:that.data.value - 25
      })
      }
      this.setData({
        sms:[event.detail.value,0,that.data.errorcolor,'验证码错误'],
    })
  }
  },
*/
  

on_check_url(event){
    var that = this
    if(userlogin.checkUrl(event.detail.value)){
      that.setData({
          url:[event.detail.value,0,that.data.truecolor,'']
        })  
    }else{
      that.setData({
          url:[event.detail.value,0,that.data.errorcolor,"设备号错误"]
        })
    }
  },
  on_check_password(event){
    var that = this
    if(userlogin.checkPassword(event.detail.value)){
      if(that.data.password[1]==0){
        that.setData({
          value: that.data.value+25,
        })
      }
      that.setData({
          password:[event.detail.value,25,that.data.truecolor,'']
        })  
    }else{
      if(that.data.password[1]==25){
        that.setData({
          value: that.data.value - 25 
      })
      }
      that.setData({
          password:[event.detail.value,0,that.data.errorcolor,"密码长度需为6-12字符且由数字和字母组成"]
        })
    }
  },
  on_check_tpassword(event){
    var that = this
    var t_password = event.detail.value 
    if(userlogin.checkPassword(t_password) && t_password == that.data.password[0]){
      if(that.data.tpassword[1]==0){
        that.setData({
          value: that.data.value+25,
        })
      }
        that.setData({
          tpassword:[t_password,25,that.data.truecolor,'']
        })  
    }else{
      if(that.data.tpassword[1]==25){
        that.setData({
          value: that.data.value - 25 
      })
      }
        that.setData({
          tpassword:[t_password,0,that.data.errorcolor,"密码不一致，请输入相同密码"]
        })
    }
  },
  
/*
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
    this.setData({
      count:0,
      showcounttime:true,
    })
  },
  */


// 点击注册按钮   没调用
  finallylogin:function(e){
    var that = this
    try{
      var phonenumber = wx.getStorageSync('phonenumber')
    }catch(e){}

    if(that.data.value==100 && phonenumber != that.data.phonenumber[0]){
      try {
        wx.setStorageSync('account', that.data.account)
        wx.setStorageSync('username', that.data.username[0])
        wx.setStorageSync('phonenumber', that.data.phonenumber[0])
        wx.setStorageSync('password', that.data.password[0])
        wx.setStorageSync('url', that.data.url[0])
      } catch (e) { 
      }
      finally{      
          wx.reLaunch({
          url: '/pages/login/login',
      })           
      }  
    }
    else if(phonenumber == that.data.phonenumber[0]){
      Toast.fail('注册失败,该手机号已被注册');
    }else {
      Toast.fail('注册失败');
    }
  },


})