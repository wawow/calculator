//index.js
//获取应用实例
const app = getApp();
var util = require('../../utils/util.js');
var amapFile = require('../../utils/amap-wx.js');
var sliderWidth = 96;

Page({
	onShareAppMessage: function (res) {
		return this.data.shareData
	},
	data: {
		tabs: ["个税计算", "年终计算"],
		activeIndex: 0,
        sliderOffset: 0,
        sliderLeft: 0,
		city : '请选择城市',
		custom : false, //自定义社保基数
		zdShiYeBl : 0.5, //自定义失业保险金比例
		zdGjjBl : 10, //自定义公积金比例
		zdYangLaoBl : 8, //自定义公积金比例
		zdYlBl : 2, //自定义公积金比例
		citydata : {
			yanglao : '', //养老金
			gjj : '', //公积金
			yiliao : '', //医保
			shiye : '', //失业
			yanglaoBl : '', //社保基数
			gjjBl : '', //公积金基数
			yiliaoBl : '', //医疗基数
			shiyeBl : '', //失业基数
			wage : '', //当地平均工资
			wageMax : '', //当地工资上限
			wageMin : '', //当地工资下限
			gjjMax : '', //公积金最大
			gjjMin : '' //公积金最小
		},
		insurance : '',
		fund : '',
		money: '',
		show : 'none',
		showYear : 'none',
		shareData : {
			path : '/pages/index/index'
		},
		yearAwardAfter : '',
		yearAward : ''
	},
	onLoad(option) {
		var t = this;
		wx.getSystemInfo({
            success: function(res) {
                t.setData({
                    sliderLeft: (res.windowWidth / t.data.tabs.length - sliderWidth) / 2,
                    sliderOffset: res.windowWidth / t.data.tabs.length * t.data.activeIndex
                });
            }
        });
		t.getCity(option);
	},
	getCity(option) {
		let t = this;
		var city = option.city;
		if(city){
			t.setData({
				city: city
			});
			t.getCityData(city);
		}else{
			var myAmapFun = new amapFile.AMapWX({key:'536e0fcadf78c63f2ad7f413a672462e'});
			myAmapFun.getRegeo({
				success:(data) => {
				let city = data[0].regeocodeData.addressComponent.province;
				wx.request({
					url: app.globalData.baseUrl + 'api/detail.php',
					data:{
						all : 'city'
					},
					success: function(res) {
						for(var i = 0;i<res.data.length;i++){
							if(!(city.indexOf(res.data[i].cityname))){
								var cityName = res.data[i].cityname;
								t.setData({
									city: cityName
								});
							}
						}
						t.getCityData(cityName);
					}
				});

			},
				fail: () => {
					t.openToast('定位失败，请手动选择城市！');
					t.setData({
						city: app.globalData.defaultCity
					});
					t.getCityData(app.globalData.defaultCity);
				}
			});
		}
	},
	getCityData(city){
		let t = this;
		wx.request({
		    url: app.globalData.baseUrl + 'api/detail.php',
		    data:{
		        city : city
		    },
		    success: function(res) {
		    	let data = res.data;
		        t.setData({
		            citydata : {
			            yanglaoBl : util.formatNum(data.ylBl/100),
		                gjjBl : util.formatNum(data.gjjBl/100),
		                yiliaoBl : util.formatNum(data.yiliaoBl/100),
		                shiyeBl : util.formatNum2(data.shiyeBl/100),
		                wage : util.formatNum(data.wage),
			            dbyiliao_qian : data.dbyiliao_qian,
			            dbyiliao_bl : data.dbyiliao_bl,
		                wageMax : !(data.wageMax == null) ? util.formatNum(data.wageMax) : util.formatNum(data.wage*3),
		                wageMin : !(data.wageMin == null) ? util.formatNum(data.wageMin) : util.formatNum(data.wage*0.6),
		                gjjMax : !(data.gjjMax == null) ? util.formatNum(data.gjjMax) : util.formatNum(data.wage*3),
		                gjjMin : !(data.gjjMin == null) ? util.formatNum(data.gjjMin) : util.formatNum(data.wage*0.6)
		            }
		        });
		    }
		});
	},
	count() {
		//获取税后工资
		let t = this,
			data = t.data,
			money = data.money,
			citydata = data.citydata;
		//公积金、社保如果用户自定义以自定义为主
		var insurance = util.getBase(data.insurance,citydata.wageMin,citydata.wageMax),
			fund = util.getBase(data.fund,citydata.gjjMin,citydata.gjjMax);
		t.setData({
			insurance : insurance,
			fund : fund
		});
		if(data.custom){
			var gjjBl = util.formatNum(data.zdGjjBl/100);
			var syBl = util.formatNum2(data.zdShiYeBl/100);
			var yanglaoBl = util.formatNum(data.zdYangLaoBl/100);
			var ylBl = util.formatNum2(data.zdYlBl/100);
		}else{
			var gjjBl = citydata.gjjBl;
			var syBl = citydata.shiyeBl;
			var yanglaoBl = citydata.yanglaoBl;
			var ylBl = util.formatNum(citydata.yiliaoBl) + util.formatNum(citydata.dbyiliao_bl);
		}
		var	yanglao = util.getBase(insurance,citydata.wageMin,citydata.wageMax,yanglaoBl),
			yiliao = util.getBase(insurance,citydata.wageMin,citydata.wageMax,ylBl) + util.formatNum(citydata.dbyiliao_qian),
			shiye = util.getBase(insurance,citydata.wageMin,citydata.wageMax,syBl),
			zhufang = util.getBase(fund,citydata.gjjMin,citydata.gjjMax,gjjBl),
			shuiqian = util.formatNum(money - yanglao - yiliao - shiye - zhufang),
			individualIncomeTax = util.formatNum(util.getTax(shuiqian)),
			postTaxWage = util.formatNum(shuiqian - individualIncomeTax);
		if(money == '' && t.data.activeIndex == 0){
			t.openToast('请输入月薪');
			t.setData({
				show : 'none'
			});
			return false;
		}else{
			t.setData({
				yanglao : yanglao,
				yiliao: yiliao,
				shiye: shiye,
				zhufang: zhufang,
				gjjBl : util.formatNum(gjjBl * 100),
				yanglaoBl : util.formatNum(yanglaoBl * 100),
				yiliaoBl : util.formatNum(ylBl * 100),
				shiyeBl : util.formatNum(syBl * 100),
				postTaxWage: postTaxWage,
				individualIncomeTax : individualIncomeTax,
				show : 'block'
			});
			t.getCanvasImage();
		}
	},
	countYearAward() {
		//获取年终奖
		let t = this,
			data = t.data,
			yearAward = data.yearAward;
		var yearAwardAfter = util.formatNum(util.getYearTax(yearAward));
		if(yearAward == '' && t.data.activeIndex == 1){
			t.openToast('请输入年终奖金');
			t.setData({
				showYear : 'none'
			});
			return false;
		}else{
			t.setData({
				yearAwardAfter : yearAwardAfter,
				showYear : 'block'
			});
			t.getCanvasImage();
		}
	},
	getCanvasImage(){
		let t = this;
		const ctx = wx.createCanvasContext('firstCanvas');
		ctx.save()
		ctx.drawImage('../../static/images/qrcode.jpg',0,0,200,160);
		ctx.restore()
		ctx.draw();
		wx.canvasToTempFilePath({
			x: 0,
			y: 0,
			width: 200,
			height: 160,
			destWidth: 200,
			destHeight: 160,
			canvasId: 'firstCanvas',
			success : (res) => {
				wx.saveFile({
					tempFilePath: res.tempFilePath,
					success:(res) => {
						//更新分享标题
						t.setData({
							shareData : {
								imageUrl : res.savedFilePath
							}
						});
					}
				});
			},
			fail : (e) =>{
				console.log(e)
			}
		});
	},
	setMoney(e) {
		var t = this,
			data = t.data,
			money = e.detail.value;
		t.setData({
			money: money,
			insurance : util.getBase(money,data.citydata.wageMin,data.citydata.wageMax),
			fund : util.getBase(money,data.citydata.gjjMin,data.citydata.gjjMax)
		});
	},
	setYearAward(e){
		var t = this,
			data = t.data,
			yearAward = e.detail.value;
		t.setData({
			yearAward: yearAward
		});
	},
	setInsurance(e) {
		this.setData({
			insurance : e.detail.value
		});
	},
	setFund(e) {
		this.setData({
			fund : e.detail.value
		});
	},
	switchChange(e){
		this.setData({
			custom : e.detail.value
		});
	},
	getZdShiYeBl(e){
		this.setData({
			zdShiYeBl : util.formatNum(e.detail.value)
		});
	},
	getZdGjjBl(e){
		this.setData({
			zdGjjBl : util.formatNum(e.detail.value)
		});
	},
	getZdYangLaoBl(e){
		this.setData({
			zdYangLaoBl : util.formatNum(e.detail.value)
		});
	},
	getZdYlBl(e){
		this.setData({
			zdYlBl : util.formatNum(e.detail.value)
		});
	},
	openToast(name) {
		wx.showModal({
			content: name,
			showCancel : false
		})
	},
	tabClick(e) {
        this.setData({
            sliderOffset: e.currentTarget.offsetLeft,
            activeIndex: e.currentTarget.id,
			money : '',
			insurance : '',
			fund : '',
			yearAward : '',
			show : 'none',
			showYear : 'none',
        });
    }
})
