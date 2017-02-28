var request = require('../../utils/requestService.js')
Page({
    data:{
        isLogin:'',
        page:'',
        token:'',
        cartCount:'',
        cartItem:[],
        selectedAllStatus: true,
        total:'',
        jd:true,
        remove:[],
        buyarr:'',
        hintMsg:'',
        toToast:true,
    },
    onLoad:function(options){
        this.setData({
            page: getCurrentPages().length
        })
    },

    checkImg(e){
        var that = this
        var index = parseInt(e.currentTarget.dataset.index);
        var selected = that.data.cartItem[index].selected;
        var cartItem = that.data.cartItem;
        cartItem[index].selected = !selected;
        that.setData({
            cartItem: cartItem
        })
        var arr = [];
        var str = '';
        var total = 0;
        var skuid=[];
        var num =[];
        var t = '';
        var s='[';
        for (var i =0; i<that.data.cartItem.length; i++ ){
            arr[i] = that.data.cartItem[i].selected;
            if (that.data.cartItem[i].selected){
                total +=that.data.cartItem[i].total_price;
                skuid[i]=that.data.cartItem[i].target_id;
                num[i]=that.data.cartItem[i].n;
            }
        }
        for(var i = 0 ;i<skuid.length;i++){
            if(skuid[i] == "" || typeof(skuid[i]) == "undefined"){
                skuid.splice(i,1);
                i= i-1;
                  
            }      
        }
        for(var i = 0 ;i<num.length;i++){
            if(num[i] == "" || typeof(num[i]) == "undefined"){
                num.splice(i,1);
                i= i-1;
                  
            }      
        }
        //skuid.splice(index, 1);
        //num.splice(index, 1);
        for (var i=0;i<skuid.length;i++){
            t=i==skuid.length-1?'':','
            s +='{'+'"'+'target_id'+'"'+':'+skuid[i]+','+'"'+'n'+'"'+':'+num[i]+'}'+t
        }
        s+=']';
        that.setData({
            buyarr: s
        })
        var n = parseInt(arr.length - 1)
        str = arr.join();
        if( str.length == parseInt(5*n+4)){
            that.setData({
                selectedAllStatus: true,
                total: (total).toFixed(2),
                buyarr: that.data.buyarr
            })
        }else{
            that.setData({
                selectedAllStatus: false,
                total: (total).toFixed(2),
                buyarr: s
            }) 
        }
    },
    //删除
    close(e){
        var that = this;
        var index = e.currentTarget.dataset.index;
        var url= '/app/w_api/cart/remove_cart';
        var array = JSON.stringify([{"target_id":e.currentTarget.dataset.id}]);
        var remove = that.data.remove;
        var cartItem = that.data.cartItem;
        var skuid=[];
        var num =[];
        var t = '';
        var s='[';
        request.post(url,{array:array,token:that.data.token},function(res){
            if (res.success == true){
                remove[index] = false;
                cartItem.splice(index,1);
                that.setData({
                    cartItem: cartItem
                })
                var total = 0;
                if (cartItem.length == 0){
                    that.setData({
                        cartCount: 0,
                    })
                }else{
                    for (var i =0; i<that.data.cartItem.length; i++ ){
                        if (that.data.cartItem[i].selected){
                            total +=that.data.cartItem[i].price*that.data.cartItem[i].n;
                            skuid[i]=that.data.cartItem[i].target_id;
                            num[i]=that.data.cartItem[i].n;
                        }
                        //console.log(that.data.cartItem[i].vop_id)
                        if (that.data.cartItem[i].vop_id !== '' ){
                            var jd = false;
                            remove[i]=true;
                        }
                        if (jd == undefined ){
                            jd = true
                        }
                    }
                    for (var i=0;i<skuid.length;i++){
                        t=i==skuid.length-1?'':','
                        s +='{'+'"'+'target_id'+'"'+':'+skuid[i]+','+'"'+'n'+'"'+':'+num[i]+'}'+t
                    }
                    s+=']';
                    that.setData({
                        remove: remove,
                        cartItem: cartItem,
                        total: (total).toFixed(2),
                        jd : jd,
                        remove : remove,
                        buyarr: s
                    })
                }
                
            }
        }) 
    },
    bindSelectAll(e) {
        var that = this;
        var selectedAllStatus = !that.data.selectedAllStatus;
        var cartItem = that.data.cartItem;
        if ( that.data.selectedAllStatus == false ){
            var skuid=[];
            var n =[];
            var t = '';
            var s='[';
            var total = 0;
            for (var i = 0;i < cartItem.length;i++) {
                cartItem[i].selected = true;
                total += cartItem[i].price * cartItem[i].n;
                skuid[i]=cartItem[i].target_id;
                n[i]=cartItem[i].n;
            }
            for (var i=0;i<skuid.length;i++){
                t=i==skuid.length-1?'':','
                s +='{'+'"'+'target_id'+'"'+':'+skuid[i]+','+'"'+'n'+'"'+':'+n[i]+'}'+t
            }
            s+=']'
            that.setData({
                    total: (total).toFixed(2),
                    buyarr: s
            })
        }else{
            for (var i = 0;i < cartItem.length;i++) {
                cartItem[i].selected = false;
            }
            that.setData({
                total: 0
            })
        }
        that.setData({
            selectedAllStatus: selectedAllStatus, 
            cartItem: cartItem 
        });
    },
    //结算
    buyArr(e){
        var that = this;
        wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: 3000
        });
        var url = '/app/w_api/order/cart_buy';
        //console.log(that.data.buyarr)
        request.post(url,{array:that.data.buyarr,token:that.data.token},function(res){
            //console.log(res)
            wx.hideToast()
            if( res.success == true ){
                wx.navigateTo({
                    url: '../nowbuy/nowbuy?buyarr='+that.data.buyarr
                })
            }else{
                wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: res.message,
                    confirmColor: '#be8914',
                })
            }
        })
    },
    onShow:function(){
        var that = this;
        var value = wx.getStorageSync('user');
        if (value) {
            that.setData({
                isLogin: true,
                token: value.token
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
        if ( this.data.isLogin == true){
            var url = '/app/w_api/cart/fetch_cart';
            request.post(url,{token:that.data.token},function(res){
                if (res.data.item_count == 0){
                    that.setData({
                        cartCount: res.data.item_count
                    })
                }else{
                    var remove = that.data.remove;
                    var skuid=[];
                    var n =[];
                    var t = '';
                    var s='[';
                    for (var i =0; i<res.data.items.length; i++ ){
                        if (res.data.items[i].vop_id !== '' ){
                            var jd = false;
                            remove[i]=true;
                        }
                        skuid[i]=res.data.items[i].target_id;
                        n[i]=res.data.items[i].n;
                        
                    }
                    for (var i=0;i<skuid.length;i++){
                        t=i==skuid.length-1?'':','
                        s +='{'+'"'+'target_id'+'"'+':'+skuid[i]+','+'"'+'n'+'"'+':'+n[i]+'}'+t
                    }
                    s+=']'
                    //console.log(s)
                    that.setData({
                        cartCount: res.data.item_count,
                        cartItem: res.data.items,
                        total: (res.data.total_price).toFixed(2),
                        jd : jd,
                        remove : remove,
                        buyarr: s
                    })
                }

            })
        }
        
    },
    goHome(e){
        wx.switchTab({
            url:'../index/index'
        })
    },
    onHide:function(){
    // 页面隐藏
        var that = this;
        that.setData({
            selectedAllStatus: true, 
        })
    },
    onUnload:function(){
    // 页面关闭
    }
})