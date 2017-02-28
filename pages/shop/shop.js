var request = require('../../utils/requestService.js')
Page({
    data:{
        catelist: [],
    },
    onLoad:function(options){
        var that = this;
        var url = '/app/w_api/category/getlist'
        request.post(url,{token:wx.getStorageSync('user').token},function(res){
            //console.log(res);
            that.setData({
                catelist: res.data.rows,
            })
        })

    // 页面初始化 options为页面跳转所带来的参数
    },
    golist(e){
        //console.log(e)
        wx.navigateTo({
            url: '../list/list?id='+e.currentTarget.dataset.id+'&title='+e.currentTarget.dataset.title
        })
    },
    onReady:function(){
    // 页面渲染完成
    },
    onShow:function(){
    // 页面显示
    },
    onHide:function(){
    // 页面隐藏
    },
    onUnload:function(){
    // 页面关闭
    }
})