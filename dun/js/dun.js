var curJD; //现在日期
var curTZ; //当前时区

Date.prototype.to_s = function(){
	var month, day;
	month = this.getMonth() + 1;
	day = this.getDate();
	month = month < 10 ? '0' + month : month;
	day = day < 10 ? '0' + day : day;
	return this.getFullYear() + '-' + month + '-' + day + ' ' + this.getHours() + ':' + this.getMinutes() + ':' + this.getSeconds(); 
};

var dun = {
	init: function(){
		this.jieqi = [];
		this.data = {};
		
		var arr = [];
		for(var i = 0, l = JWv.length; i < l; i++){
			arr.push('<option value="' + i + '">' + JWv[i][0] + '</option>');
		}
		$('#Sel1').empty().html(arr.join(''));
		
		var self = this;
		$('#Sel1').change(function(){
			Sel2.length = 0;
			var i, ob = JWv[Sel1.options[Sel1.selectedIndex].value - 0];
			for( i = 1; i < ob.length; i++)
				addOp(Sel2, ob[i].substr(0, 4), ob[i].substr(4, ob[i].length - 4));
			$('#Sel2').trigger('change');
		});
		
		$('#Sel2').change(function(){
			var v = new JWdecode(Sel2.options[Sel2.selectedIndex].value);
			Sel2.vJ = v.J;
			Sel2.vW = v.W;
			$('#Cp11_J').val((v.J / Math.PI * 180).toFixed(6));
			Cal_zdzb.innerHTML = '<b>经</b>' + rad2str2(v.J) + '<b>纬</b>' + rad2str2(v.W);
			setCookie('Sel1', Sel1.selectedIndex);
			setCookie('Sel2', Sel2.selectedIndex);
		});
		
		$('#Sel1').trigger('change');

		this.ML_settime();
		
		$('#ML_settime').click(function(){
			self.ML_settime();
		});
		$('#ML_calc').click(function(){
			self.ML_calc();
		});
	},
	ML_calc: function(){		
		this.data = {};
		
		var ob = new Object();
		var t = timeStr2hour(Cml_his.value);
		var jd = JD.JD(year2Ayear(Cml_y.value), Cml_m.value - 0, Cml_d.value - 0 + t / 24);
		
		obb.mingLiBaZi(jd + curTZ / 24 - J2000, Cp11_J.value / radd, ob);
		//八字计算
		var arr = [];
		arr.push('<font color=red>  <b>[日标]：</b></font>' + '公历 ' + Cml_y.value + '-' + Cml_m.value + '-' + Cml_d.value + ' 儒略日数 ' + int2(jd + 0.5) + ' 距2000年首' + int2(jd + 0.5 - J2000) + '日');
		arr.push('<font color=red  ><b>[八字]：</b></font>' + ob.bz_jn + '年 ' + ob.bz_jy + '月 ' + ob.bz_jr + '日 ' + ob.bz_js + '时 真太阳 <font color=red>' + ob.bz_zty + '</font>');
		var tarr = ob.bz_JS.replace(/<font(.*?)>(.*?)<\/font>/, "$2").split(' ');
		var t = $(tarr).map(function(){
				if(ob.bz_js == this){
					return '<i class="cur">' + this + '</i>';
				} else {
					return '<i>' + this + '</i>';
				}
			}).get().join('');
		arr.push('<font color=green><b>[纪时]：</b></font><span id="dun-shi">' + t + '</span>');
		arr.push('<font color=green><b>[时标]：</b></font><span>23　 01　 03　 05　 07　 09　 11　 13　 15　 17　 19　 21　 23</span>');
		$('#Cal6').html(arr.join('<br />'));
		
		this.data['bz_jn'] = ob.bz_jn;  // 年干支
		this.data['bz_jy'] = ob.bz_jy;	// 月
		this.data['bz_jr'] = ob.bz_jr;	// 日
		
		var self = this;
		$('#dun-shi i').unbind().click(function(){
			var index = $(this).index(), js = tarr[index];
			self.c_ju(js, tarr[0], ob.bz_js, index);
		});
	},
	
	c_ju: function(js, zi_gz, bz_js, index){
		var time_s = new Date();
		time_s.setYear(Cml_y.value);
		time_s.setMonth(parseInt(Cml_m.value, 10) - 1);
		time_s.setDate(Cml_d.value);
			
		if(bz_js != js){
			if(index == 0){
				time_s.setDate(time_s.getDate() - 1);
			}
			time_s.setHours([23, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21][index]);
			time_s.setMinutes(0);
			time_s.setSeconds(0);
		} else {			
			var aaaa = Cml_his.value.split(':');
			time_s.setHours(aaaa[0]);
			time_s.setMinutes(aaaa[1]);
			time_s.setSeconds(aaaa[2]);
		}
		
		this.data['time_s'] = time_s;	// 北京时间
		this.data['bz_js'] = js;	// 时干支
		this.data['zi_gz'] = zi_gz;		// 子时干支
		
		$('#re').show();
		$('#jieqi').html(this.nianLiHTML(this.year2Ayear(parseInt(Cml_y.value, 10))));
		
		var from_qiTitle, from_qiTime, to_qiTitle, to_qiTime;
		this.yy = 'b'; // 阴阳 阴
		for(var i = 0, l = this.jieqi.length; i < l; i ++){
			to_qiTitle = this.jieqi[i]['qi_title'], to_qiTime = this.jieqi[i]['qi_time'].trim();
			var d = d1 = d2 = [];
			d = to_qiTime.split(' ');
			d1 = d[0].split('-');
			d2 = d[1].split(':');
			d = new Date();
			d.setFullYear(d1[0]);
			d.setMonth(parseInt(d1[1], 10) - 1);
			d.setDate(d1[2]);
			d.setHours(d2[0]);
			d.setMinutes(d2[1]);
			d.setSeconds(d2[2]);
			if(to_qiTitle == '小寒'){
				this.yy = 'a';
			}
			if(to_qiTitle == '小暑'){
				this.yy = 'b';
			}
			if(d > time_s){
				from_qiTitle = this.jieqi[i - 1]['qi_title'], from_qiTime = this.jieqi[i - 1]['qi_time'];
				break;
			}
		}
		
		var ju = {
			'冬至': [1, 7, 4],
			'小寒': [2, 8, 5], 
			'大寒': [3, 9, 6], 
			'立春': [8, 5, 2], 
			'雨水': [9, 6, 3], 
			'惊蛰': [1, 7, 4], 
			'春分': [3, 9, 6], 
			'清明': [4, 1, 7], 
			'谷雨': [5, 2, 8], 
			'立夏': [4, 1, 7], 
			'小满': [5, 2, 8], 
			'芒种': [6, 3, 9], 
			'夏至': [9, 3, 6], 
			'小暑': [8, 2, 5], 
			'大暑': [7, 1, 4], 
			'立秋': [2, 5, 8], 
			'处暑': [1, 4, 7], 
			'白露': [9, 3, 6], 
			'秋分': [7, 1, 4], 
			'寒露': [6, 9, 3], 
			'霜降': [5, 8, 2], 
			'立冬': [6, 9, 3], 
			'小雪': [5, 8, 2], 
			'大雪': [4, 7, 1]
		};
		
		var select_info = ['<p>Info:</p>'];
		select_info.push('<p>' + this.data['bz_jn'] + ' ' + this.data['bz_jy'] + ' ' + this.data['bz_jr'] + ' ' + this.data['bz_js'] + '</p>');
		select_info.push('<p>' + from_qiTitle + ' : ' + from_qiTime + '</p>');
		select_info.push('<p>' + this.data['time_s'].to_s() + '</p>');
		select_info.push('<p>' + to_qiTitle + ' : ' + to_qiTime + '</p>');
		var yuan = this.c_yuan(this.data['bz_jr']);
		this.ju = this.yy + ju[from_qiTitle][yuan];
		select_info.push('<p>' + this.ju + '</p>');
		select_info.push('<p>符头：' + this.futou + '</p>');
		
		$('#select-info').html(select_info.join(''));
		
		this.p_dipan();
	},
	
	p_dipan: function(){
		var arr = this.ju.split('');
		
		var yiqi = ["戊", "己", "庚", "辛", "壬", "癸", "丁", "丙", "乙"];  // 六仪三奇
		var j = parseInt(arr[1], 10);
		
		for(var i = 1; i <= 9; i ++){
			$('#db' + i).html(i);
		}
		this.dipan_data = [];
		if(this.yy == 'a'){
			for(var i = 0; i < 9; i ++){
				$('#db' + j).append('<br />' + yiqi[i]);
				this.dipan_data[j-1] = yiqi[i];
				j ++;
				if(j >= 10){
					j = 1;					
				}
			}
		} else {
			for(var i = 0; i < 9; i ++){
				$('#db' + j).append('<br />' + yiqi[i]);
				this.dipan_data[j-1] = yiqi[i];
				j --;
				if(j <= 0){
					j = 9;
				}
			}			
		}
		
		this.p_tianpan();
	},
	
	p_tianpan: function(){
		var gong = [1, 8, 3, 4, 9, 2, 7, 6];
		var jiuxing = ['天蓬', '天芮', '天冲', '天辅', '天禽', '天心', '天柱', '天任', '天英'];
		var liujia = ['甲子', '甲戌', '甲申', '甲午', '甲辰', '甲寅'];
		var liuyi = ["戊", "己", "庚", "辛", "壬", "癸"];
		var bameng = ['休', '生', '伤', '杜', '景', '死', '惊', '开'];
		var bamengG = ['休', '死', '伤', '杜', '', '开', '惊', '生', '景'];
		var bashengA = ['大值符', '腾蛇', '太阴', '六合', '白虎(勾陈)', '玄武(朱雀)', '九地', '九天'];
		var xunshou = this.c_xunshou(this.data['bz_js']);
		
		var i, j;
		for(i = 0; i < 6; i ++){
			if(xunshou == liujia[i]){
				break;
			}
		}
		for(j = 0; j < 9; j ++){
			if(this.dipan_data[j] == liuyi[i]){
				break;
			}
		}
		var zhifu = jiuxing[j], zhishi = bamengG[j];
		
		var shi = this.data['bz_js'].split('')[0];
		for(var m = 0; m < 9; m ++){
			if(this.dipan_data[m] == shi){
				break;
			}
		}
		m ++;
		console.log(m);
		
		for(var n = 0; n < 9; n ++){
			$('#db' + m).append('<br />' + jiuxing[j]);
			m ++;
			j ++;
			if(m > 9){
				m = 1;
			}
			if(j > 8){
				j = 0;
			}
		}
		
		$('#db' + m).append('<br />' + bamengG[j]);
		for(var n = 0; n < 8; n ++){
			if(this.yy == 'a'){
				
			} else {
				
			}
			
		}
	},
	
	c_xunshou: function(gz){
		var Gan = new Array("甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"),
			Zhi = new Array("子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥");
		
		var tarr = ['<br /><br />'];		
		for(var o = 0, p = 0; o < 6; o ++){
			for(var i = 0; i < 10; i ++){
				if(i == 5){
					tarr.push('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
				}
				tarr.push(Gan[i] + '&nbsp;');
			}
			tarr.push('<br />');
			
			for(var j = 0; j < 10; j ++, p ++){
				if( p == 12){
					p = 0;
				}
				if(j == 5){
					tarr.push('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;');
				}
				tarr.push(Zhi[p] + '&nbsp;');
			}
			tarr.push('<br /><br />');
		}
		$('#jieqi').append(tarr.join(''));
		
		var arr = gz.split(''), i, j, l;
		for(i = 0, l = Gan.length; i < l; i ++){
			if( Gan[i] == arr[0] ){
				break;
			}
		}
		for(j = 0, l = Zhi.length; j < l; j ++){
			if( Zhi[j] == arr[1] ){
				break;
			}
		}
		
		var xs = Gan[0] + Zhi[(j - i < 0 ? j + 12 - i : j - i)];
		return xs;
	},
	
	c_yuan: function(gz){
		var Gan = new Array("甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"),
			Zhi = new Array("子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥");
		var arr = gz.split(''), i, j, l, yuan;
		for(i = 0, l = 10; i < l; i ++){
			if( Gan[i] == arr[0] ){
				break;
			}
		}
		for(j = 0, l = 12; j < l; j ++){
			if( Zhi[j] == arr[1] ){
				break;
			}
		}
		var yuantou;
		if(i >= 5){
			i = i - 5;
			yuantou = Zhi[(j - i < 0 ? j + 12 - i : j - i)];
			this.futou = '己' + yuantou;
		} else {
			yuantou = Zhi[(j - i < 0 ? j + 12 - i : j - i)];
			this.futou = '甲' + yuantou;
		}
		
		// console.log(futou);		
		
		if('子午卯酉'.indexOf(yuantou) >= 0){
			yuan = 0;
		}
		if('寅申巳亥'.indexOf(yuantou) >= 0){
			yuan = 1;
		}
		if('辰戌丑未'.indexOf(yuantou) >= 0){
			yuan = 2;
		}
		return yuan;
	},
	
	set_date_screen: function(){
		var now = new Date();
		curTZ = now.getTimezoneOffset() / 60;
		//时区 -8为北京时
		curJD = now / 86400000 - 10957.5 - curTZ / 24;
		//J2000起算的儒略日数(当前本地时间)
		JD.setFromJD(curJD + J2000);

		$('#Cml_y').val(JD.Y);
		$('#Cml_m').val(JD.M);
		$('#Cml_d').val(JD.D);
		$('#Cml_his').val(JD.h + ':' + JD.m + ':' + JD.s.toFixed(0));
		
		curJD = int2(curJD + 0.5);
	},

	ML_settime: function(){
		this.set_date_screen(); 
		this.ML_calc();
	},

	get: function(){
		this.year = parseInt($('#year').val(), 10);
		this.getNianLi();
	},
	year2Ayear: function(c){ //传入普通纪年或天文纪年，传回天文纪年
		var y = String(c).replace(/[^0-9Bb\*-]/g, '');
		var q = y.substr(0,1);
		if( q == 'B' || q == 'b' || q == '*' ){ //通用纪年法(公元前)
			y = 1 - y.substr(1, y.length);
			if( y > 0 ){
				alert('通用纪法的公元前纪法从B.C.1年开始。并且没有公元0年'); 
				return -10000;
			}
		} else {
			y -= 0;
		}
		if( y < -4712 ){
			alert('超过B.C. 4713不准'); 
		}
		if( y > 9999 ){
			alert('超过9999年的农历计算很不准。');
		}
		return y;
	},
	Ayear2year: function(y){ //传入天文纪年，传回显示用的常规纪年
		y -= 0;
		if( y <= 0 ){
			return 'B' + ( -y + 1 );
		}
		return '' + y;
	},
	nianLiHTML: function(y){ //html年历生成
		this.jieqi = [];
		var i, j, s = '', s1, s2, v, qi;
		SSQ.calcY( int2((y-2000)*365.2422+180) );
		for( i = 0; i < 14; i ++ ){
			if( SSQ.HS[ i + 1 ] > SSQ.ZQ[24] ){
				break; //已包含下一年的冬至
			}
			if(SSQ.leap && i==SSQ.leap){
				s1 = '闰'; 
			} else {
				s1 = '·';
			}
			s1 += SSQ.ym[i];
			if(s1.length<3){
				s1 += '月';
			}
			s1 += SSQ.dx[i] > 29 ? '大' : '小';
			s1 += ' ' + JD.JD2str(SSQ.HS[i] + J2000).substr(6, 5);
			
			v = obb.so_accurate2(SSQ.HS[i]);
			s2 = '(' + JD.JD2str( v + J2000 ).substr(9, 11) + ')';
			if(int2(v + 0.5) != SSQ.HS[i]){
				s2 = '<font color=red>' + s2 + '</font>';
			}
			//v=(v+0.5+J2000)%1; if(v>0.5) v=1-v; if(v<8/1440) s2 = '<u>'+s2+'</u>'; //对靠近0点的加注
			s1 += s2;
			
			
			for( j = -2; j < 24; j++) {
				if(j >= 0)
					qi = SSQ.ZQ[j];
				if(j == -1)
					qi = SSQ.ZQ.pe1;
				if(j == -2)
					qi = SSQ.ZQ.pe2;

				if(qi < SSQ.HS[i] || qi >= SSQ.HS[i + 1])
					continue;
				
				var qi_title = obb.jqmc[(j + 24) % 24];
				s1 += ' ' + qi_title + JD.JD2str(qi + J2000).substr(6, 5);

				v = obb.qi_accurate2(qi);
				
				var qi_time = JD.JD2str(v + J2000);
				this.jieqi.push(
					{
						'qi_title': qi_title,
						'qi_time': qi_time
					}
				);
				
				s2 = '(' + qi_time.substr(9, 11) + ')';
				if(int2(v + 0.5) != qi)
					s2 = '<font color=red>' + s2 + '</font>';
				//v=(v+0.5+J2000)%1; if(v>0.5) v=1-v; if(v<8/1440) s2 = '<u>'+s2+'</u>'; //对靠近0点的加注
				s1 += s2;
			}

			s += s1 + '<br>';
		}
		return s;
	}
};

$(document).ready(function(){
	dun.init();
});
