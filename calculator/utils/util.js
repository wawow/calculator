const formatNum = (n,m) => {
    if (n == null) {
        return 0;
    } else {
        n = parseFloat(n);
        if (isNaN(n)) {
            console.log('格式不正确，请重新传值');
            return false;
        }
        m = !m ? 100 : 1000;
        return Math.round(n * m) / m;
    }
}
const getBase = (money,min,max,scale) =>{
	var scale = scale == 0 ? 0 : scale || 1;
	if(money < min){
		return formatNum(min * scale);
	}else if(money > max){
		return formatNum(max * scale);
	}else{
		return formatNum(money * scale);
	}
}
const getTax = (money,isYear) => {
    var moneyAfter = !isYear ? (money - 3500) : (money / 12);
    const taxS = [0,105,555,1005,2755,5505,13505];
    const rateS = [0.03,0.1,0.2,0.25,0.3,0.35,0.45];
    if (moneyAfter <= 0) {
        return 0;
    } else if (moneyAfter > 0 && moneyAfter <= 1500) {
    	return !isYear ? (formatNum(moneyAfter * rateS[0] - taxS[0])) : formatNum(money - (money * rateS[0]));
    } else if (moneyAfter > 1500 && moneyAfter <= 4500) {
	    return !isYear ? (formatNum(moneyAfter * rateS[1] - taxS[1])) : formatNum(money - (money * rateS[1] - taxS[1]));
    } else if (moneyAfter > 4500 && moneyAfter <= 9000) {
	    return !isYear ? (formatNum(moneyAfter * rateS[2] - taxS[2])) : formatNum(money - (money * rateS[2] - taxS[2]));
    } else if (moneyAfter > 9000 && moneyAfter <= 35000) {
	    return !isYear ? (formatNum(moneyAfter * rateS[3] - taxS[3])) : formatNum(money - (money * rateS[3] - taxS[3]));
    } else if (moneyAfter > 35000 && moneyAfter <= 55000) {
	    return !isYear ? (formatNum(moneyAfter * rateS[4] - taxS[4])) : formatNum(money - (money * rateS[4] - taxS[4]));
    } else if (moneyAfter > 55000 && moneyAfter <= 80000) {
	    return !isYear ? (formatNum(moneyAfter * rateS[5] - taxS[5])) : formatNum(money - (money * rateS[5] - taxS[5]));
    } else if (moneyAfter > 80000) {
	    return !isYear ? (formatNum(moneyAfter * rateS[6] - taxS[6])) : formatNum(money - (money * rateS[6] - taxS[6]));
    }
}

module.exports = {
    formatNum: formatNum,
    getTax: getTax,
	getBase: getBase
}
