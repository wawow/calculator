//index.js
//获取应用实例
const app = getApp();
var sliderWidth = 96;

Page({
	data: {
		tabs: ["个税规则", "年终规则"],
		activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
		yearData:[
			{
				"id":"1",
				"value":"不超过1500元的的部分",
				"scale":"3%",
				"num":"0"
			},{
				"id":"2",
				"value":"超过1500元至4500元的部分",
				"scale":"10%",
				"num":"105"
			},{
				"id":"3",
				"value":"超过4500元至9000元的部分",
				"scale":"20%",
				"num":"555"
			},{
				"id":"4",
				"value":"超过9000元至35000元的部分",
				"scale":"25%",
				"num":"1055"
			},{
				"id":"5",
				"value":"超过35000元至55000元的部分",
				"scale":"30%",
				"num":"2755"
			},{
				"id":"6",
				"value":"超过55000元至80000元的部分",
				"scale":"35%",
				"num":"5505"
			},{
				"id":"7",
				"value":"超过80000元的部分",
				"scale":"45%",
				"num":"13505"
			}
		]
	},
	onLoad(option){
		var t = this;
		t.setData({
			activeIndex : option.activeIndex,
			city : option.city
		});
		wx.getSystemInfo({
            success: function(res) {
                t.setData({
                    sliderLeft: (res.windowWidth / t.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / t.data.tabs.length * t.data.activeIndex
                });
            }
        });
	},
	tabClick(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id
        });
    }
})
