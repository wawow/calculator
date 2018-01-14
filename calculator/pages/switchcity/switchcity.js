const city = require('../../utils/city.js');
Page({
    data:{
        list: [],
        alpha: '',
        windowHeight: ''
    },
    onLoad(options){
        var res = wx.getSystemInfoSync()
        var t = this;
        this.pixelRatio = res.pixelRatio;
        this.apHeight = 16;
        this.offsetTop = 80;
        this.setData({windowHeight: res.windowHeight + 'px'});
        const cityObj = city.cityObj;
        const cityHot = ['北京市','上海市'];
        const cityA = [],cityB = [],cityC = [],cityD = [],cityE = [],cityF = [],cityG = [],cityH = [],cityI = [],cityJ = [],cityK = [],cityL = [],cityM = [],cityN = [],cityO = [],cityP = [],cityQ = [],cityR = [],cityS = [],cityT = [],cityU = [],cityV = [],cityW = [],cityX = [],cityY = [],cityZ = [];
        for(var i=0;i<cityObj.length;i++){
            switch (cityObj[i].initial) {
                case "A":
                cityA.push(cityObj[i].city);
                break;
                case "B":
                cityB.push(cityObj[i].city);
                break;
                case "C":
                cityC.push(cityObj[i].city);
                break;
                case "D":
                cityD.push(cityObj[i].city);
                break;
                case "E":
                cityE.push(cityObj[i].city);
                break;
                case "F":
                cityF.push(cityObj[i].city);
                break;
                case "G":
                cityG.push(cityObj[i].city);
                break;
                case "H":
                cityH.push(cityObj[i].city);
                break;
                case "I":
                cityI.push(cityObj[i].city);
                break;
                case "J":
                cityJ.push(cityObj[i].city);
                break;
                case "K":
                cityK.push(cityObj[i].city);
                break;
                case "L":
                cityL.push(cityObj[i].city);
                break;
                case "M":
                cityM.push(cityObj[i].city);
                break;
                case "N":
                cityN.push(cityObj[i].city);
                break;
                case "O":
                cityO.push(cityObj[i].city);
                break;
                case "P":
                cityP.push(cityObj[i].city);
                break;
                case "Q":
                cityQ.push(cityObj[i].city);
                break;
                case "R":
                cityR.push(cityObj[i].city);
                break;
                case "S":
                cityS.push(cityObj[i].city);
                break;
                case "T":
                cityT.push(cityObj[i].city);
                break;
                case "U":
                cityU.push(cityObj[i].city);
                break;
                case "V":
                cityV.push(cityObj[i].city);
                break;
                case "W":
                cityW.push(cityObj[i].city);
                break;
                case "X":
                cityX.push(cityObj[i].city);
                break;
                case "Y":
                cityY.push(cityObj[i].city);
                break;
                case "Z":
                cityZ.push(cityObj[i].city);
                break;
            }
        }
        t.setData({
            list : [{
                alphabet: 'Top', datas: cityHot
            },{
                alphabet: 'A', datas: cityA
            },{
                alphabet: 'B', datas: cityB
            },{
                alphabet: 'C', datas: cityC
            },{
                alphabet: 'D', datas: cityD
            },{
                alphabet: 'E', datas: cityE
            },{
                alphabet: 'F', datas: cityF
            },{
                alphabet: 'G', datas: cityG
            },{
                alphabet: 'H', datas: cityH
            },{
                alphabet: 'I', datas: cityI
            },{
                alphabet: 'J', datas: cityJ
            },{
                alphabet: 'K', datas: cityK
            },{
                alphabet: 'L', datas: cityL
            },{
                alphabet: 'M', datas: cityM
            },{
                alphabet: 'N', datas: cityN
            },{
                alphabet: 'O', datas: cityO
            },{
                alphabet: 'P', datas: cityP
            },{
                alphabet: 'Q', datas: cityQ
            },{
                alphabet: 'R', datas: cityR
            },{
                alphabet: 'S', datas: cityS
            },{
                alphabet: 'T', datas: cityT
            },{
                alphabet: 'U', datas: cityU
            },{
                alphabet: 'V', datas: cityV
            },{
                alphabet: 'W', datas: cityW
            },{
                alphabet: 'X', datas: cityX
            },{
                alphabet: 'Y', datas: cityY
            },{
                alphabet: 'Z', datas: cityZ
            }]
        })
    },
    handlerAlphaTap(e) {
        let {ap} = e.target.dataset;
        this.setData({alpha: ap});
    },
    handlerMove(e) {
        let {list} = this.data;
        let moveY = e.touches[0].clientY;
        let rY = moveY - this.offsetTop;
        if(rY >= 0) {
          let index = Math.ceil((rY - this.apHeight)/ this.apHeight);
          if(0 <= index < list.length) {
            let nonwAp = list[index];
            nonwAp && this.setData({alpha: nonwAp.alphabet});
          }
        }
    },
    handlerCity(e){
        console.log(e.currentTarget.dataset.text);
    }
})
