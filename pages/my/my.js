var request = require('../../utils/requestService.js');
Page({
    data:{
        isLogin:'',
        page:'',
        nickname:'',
        avatar_url: ''
    },
    onLoad:function(options){
        this.setData({
            page: getCurrentPages().length
        })
    },
    order(e){
        wx.navigateTo({
            url: '../order/order'
        })
    },
    address(e){
        wx.navigateTo({
            url: '../address/address'
        })
    },
    phone(e){
        wx.makePhoneCall({
            phoneNumber: '4008798751'
        })
    },
    onShow:function(){
        var value = wx.getStorageSync('user');
        if (value) {
            var that = this;
            that.setData({
                isLogin: true
            })
            var url = '/app/w_api/my/info'
            request.post(url,{token:value.token},function(res){
                that.setData({
                    nickname: res.data.nickname,
                    avatar_url: res.data.medium_avatar_url
                })
            })
        }else{
            wx.setStorageSync('page', this.data.page)
            wx.showModal({
                title: '请先登录',
                //content: '',
                confirmColor: '#be8914',
                success: function(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../login/login'
                        })
                    }else{
                        wx.switchTab({
                            url: '../index/index'
                        }) 
                    }
                }
            })
        }
    },
    onReady:function(){
    // 页面渲染完成
    }

})