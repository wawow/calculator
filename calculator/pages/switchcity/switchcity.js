const app = getApp();
Page({
    data: {
        list: [],
        alpha: '',
        windowHeight: ''
    },
    onLoad() {
        let t = this;
        var res = wx.getSystemInfoSync()
        this.pixelRatio = res.pixelRatio;
        this.apHeight = 16;
        this.offsetTop = 80;
        var list = [{alphabet: 'Top', datas: []}];
        wx.request({
            url: app.globalData.baseUrl + 'api/detail.php',
            data: {
                all: 'city'
            },
            success: function(res) {
                var citylist = res.data;
                var ABCArr = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"];
                for (var i = 0, len = ABCArr.length; i < len; i++) {
                    list.push({
                        "alphabet": ABCArr[i],
                        "datas": []
                    });
                    citylist.forEach(function(val) {
                        if (val.initial == ABCArr[i]) {
                            list[i+1].datas.push(val.cityname)
                        }
                    });
                }
                t.setData({
                    list: list
                });
            }
        });
        t.setData({
            windowHeight: res.windowHeight + 'px'
        });
    },
    handlerAlphaTap(e) {
        let {ap} = e.target.dataset;
        this.setData({
            alpha: ap
        });
    },
    handlerMove(e) {
        let {list} = this.data;
        let moveY = e.touches[0].clientY;
        let rY = moveY - this.offsetTop;
        if (rY >= 0) {
            let index = Math.ceil((rY - this.apHeight) / this.apHeight);
            if (0 <= index < list.length) {
                let nonwAp = list[index];
                nonwAp && this.setData({
                    alpha: nonwAp.alphabet
                });
            }
        }
    }
})
