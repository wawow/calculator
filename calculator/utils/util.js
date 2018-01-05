const formatNum = n => {
	n = parseFloat(n);
	if(isNaN(n)){
		console.log('格式不正确，请重新传值');
		return false;
	}
	return Math.round(n * 100) / 100;
}

module.exports = {
	formatNum: formatNum
}
