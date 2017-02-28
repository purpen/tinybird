var request = require('../../utils/requestService.js');
Page({
    data:{
        hidden:true,
        order:[],
        list:[],
    },
    onLoad:function(options){
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        var that = this
        wx.getSystemInfo({
            success:function(res){
                that.setData({
                    scrollHeight:res.windowHeight
                });
            }
        })
    },
    onReady:function(){
    // 页面渲染完成
    },
    onShow:function(){
        var that=this
        var url = '/app/w_api/order/getlist'
        request.post(url,{token:wx.getStorageSync('user').token},function(res){
            if (res.success == true){
                wx.hideToast()
                console.log(res)
                that.setData({
                    order: res.data,
                    list: res.data.rows
                })
            }
        })
    },
    bindDownLoad(e){
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 10000
        })
        var page =e.target.dataset.page;
        var page = ++page;
        var totalpage = e.target.dataset.totalpage;
        var that = this;
        if (totalpage >= page) {
            var url = '/app/w_api/order/getlist'
            request.post(url,{token:wx.getStorageSync('user').token,page:page},function(res){
                wx.hideToast()
                that.setData({
                    order: res.data,
                    list: that.data.list.concat(res.data.rows)
                })
            })
        }else{
            wx.showToast({
                title: '没有更多了',
                icon: 'success',
                duration: 1000
            })
            setTimeout(function(){
                wx.hideToast()
            },2000)
        }
    },
    scroll:function(event){
        this.setData({
          scrollTop: event.detail.scrollTop
        });
    },
    payFor(e){
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 3000
        });
        var that = this
        wx.login({//login流程
            success: function (res) {//登录成功
                var code = res.code;
                wx.getUserInfo({//getUserInfo流程
                    success: function (res2) {//获取userinfo成功
                        var encryptedData = res2.encryptedData;//一定要把加密串转成URI编码
                        var iv = res2.iv;
                        var url = '/app/w_api/order/pay'
                        request.post(url,{token:wx.getStorageSync('user').token,rid:e.target.dataset.rid,code:code,iv:iv,encryptedData:encryptedData},function(res){
                            wx.hideToast()
                            wx.requestPayment({
                                'appId': res.data.appid,
                                'timeStamp': String(res.data.time_stamp),
                                'nonceStr': String(res.data.nonce_str),
                                'package': 'prepay_id='+res.data.prepay_id,
                                'signType': 'MD5',
                                'paySign': String(res.data.sign),
                                'success':function(res){
                                    wx.switchTab({
                                        url:'../index/index'
                                    })
                                },
                                'fail':function(ress){
                                    wx.redirectTo({
                                        url:'../fail/fail?appId='+ res.data.appid+'&timeStamp='+ String(res.data.time_stamp)+'&nonceStr='+res.data.nonce_str+'&package='+res.data.prepay_id+'&signType=MD5'+'&paySign='+res.data.sign
                                    })
                                }
                            })

                        })
                    }
                })

            }
        })
    },
    order_view(e){
        wx.navigateTo({
          url: '../order_view/order_view?rid=' + e.currentTarget.dataset.rid
        })
    },
})