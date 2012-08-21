// JavaScript Document

function $(v){return document.getElementById(v);}

var Block = function(x, y){
	this.x = x;
	this.y = y;
	this.id = 'item_' + this.y + '_' + this.x;
	this.i = 1;
	this.elem = $(this.id);
	this.img = 'img_' + this.y + '_' + this.x;
}

Block.prototype.setImg = function(i){
	if(this.i != 0){
		this.i = i;
		this.elem.innerHTML = '<img alt="img_' + this.y + '_' + this.x + '" id="img_' + this.y + '_' + this.x + '" src="' + llk.img_path + i + '.gif"" style="width:43px;height:38px;">';
		this.bind();
		return true;
	}
	return false;
}

Block.prototype.bind = function(){
	var self = this;
	if($('img_' + this.y + '_' + this.x)){
		$('img_' + this.y + '_' + this.x).onclick = function(){
			llk.clickNode(self);		
		}	
	} else {
		console.log(this.x, this.y);
	}
}

var llk = {
	mapX: 14, 
	mapY: 10,
	mapLength: 20,
	node_width: 46,
	node_height: 41,
	img_path: 'images/llk/',
	
	remain: 0,
	level: 1,
	score: 0,
	checkBlock: null,
	path: null,
	
	arrSharps: [],
	arrBlocks: [],
	
	timeid: null,
	timer: null,
	paused: false,
	
	lastPanel: null,
	
	findBlock: function(x, y){
		for(var i = 0, l = this.arrBlocks.length; i < l; i ++){
			var t = this.arrBlocks[i];
			if(t.x == x && t.y == y){
				return t;
			}
		}
		return null;
	},
	setBoard: function(){
		var arrT = [];
		for(var i = 0, m = this.mapY + 2; i < m; i ++){
			arrT.push('<tr>');
			for(var j = 0, n = this.mapX + 2; j < n; j ++){
				arrT.push('<td id="item_' + i + '_' + j + '"></td>');				
			}
			arrT.push('</tr>');
		}
		this.dBoard.innerHTML = arrT.join('');
	},
	bind: function(){
		this.dBtnStart.onclick = function(){
			llk.start();
		};
		this.dBtnContinue.onclick = function(){
			llk.pause();
		};
		this.dBtnRestart.onclick = function(){
			llk.start();
		};
		this.dBtnNextLevel.onclick = function(){
			llk.next_level();
		};
		
		document.onkeydown = function(event){
			if (event.keyCode==49) llk.start();
			if (event.keyCode==50) llk.resetMap();
			if (event.keyCode==51) llk.note();
			if (event.keyCode==81) llk.pause();
		}
	},
	
	// public methods
	init: function(){	
		this.dStart = $("llk_start");
		this.dMain = $("llk_main");
		this.dPause = $("llk_pause");
		this.dTimeout = $("llk_timeout");
		this.dSuc = $("llk_success");
		
		this.dBoard = $('tab_main');
		
		this.dLevel = $("level");
		this.dScore = $('score');
		this.dTimeCount = $("time_count");
		this.dTimeoutScore = $("timeout_score");
		this.dSucScore = $('success_score');
		
		this.dBtnStart = $('btn_start');
		this.dBtnContinue = $('btnContinue');
		this.dBtnRestart = $('btnRestart');
		this.dBtnNextLevel = $('btnNextLevel');
		
		this.dPath = $('find_path');
		
		this.setBoard();
		this.bind();
		this.showPanel('llk_start');
	},
	start: function(){	
		this.level = 1;
		this.score = 0;		
		this.game();
	},
	next_level: function(){
		this.game();
	},
	note: function(){
		var arrT = this.next_double();
		if(arrT){
			this.choose(arrT[0]);
			this.choose(arrT[1]);
			this.clickNode(arrT[0]);
			this.clickNode(arrT[1]);
		}
		return false;
	},
	resetMap: function(){
		this.setImages();
	},
	pause: function(){
		if(!this.remain){
			return;
		}
		if(!this.paused){
			this.paused = true;
			clearInterval(this.timeid);
			this.showPanel("llk_pause");
		} else {
			this.paused = false;
			this.count();
			this.showPanel("llk_main");
		}
	},
	
	over: function(){
		clearInterval(this.timeid);
		this.showPanel("llk_timeout");
		this.dTimeoutScore.innerHTML = this.score;
	},
	success: function(){
		clearInterval(this.timeid);
		this.showPanel("llk_success");
		this.score += this.dTimeCount.width;
		this.dSucScore.innerHTML = this.score;	
		if(this.level>=8){
			this.dBtnNextLevel.style.display = "none";
		}else{
			this.level += 1;
			this.dBtnNextLevel.value = "第 " + this.level + " 关";		
		}
	},
	game: function(){
		this.sound(1);
		
		this.update_level();
		this.update_score();
		
		this.loadSharps();
		this.initTimeCount();
		this.count();
		
		this.showPanel("llk_main");
	},
	loadSharps: function(){
		this.arrSharps = [];
		this.arrBlocks = [];
		var arrT = this.randomArr([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]);
		
		switch(this.level){
			case 1:
				for(var t = 0; t < 15; t ++){
					for(var m = 0; m < 8; m ++){
						this.arrSharps.push(arrT[t]);
					}
				}
				for(var t = 15; t < 20; t ++){
					for(var m = 0; m < 4; m ++){
						this.arrSharps.push(arrT[t]);
					}
				}
				break;
			case 2:
				for(var t = 0; t < 20; t ++){
					for(var m = 0; m < 6; m ++){
						this.arrSharps.push(arrT[t]);
					}
				}
				for(var t = 20; t < 25; t ++){
					for(var m = 0; m < 4; m ++){
						this.arrSharps.push(arrT[t]);
					}
				}
				break;
			case 3:
			default:
				for(var t = 0; t < 35; t ++){
					for(var m = 0; m < 4; m ++){
						this.arrSharps.push(arrT[t]);
					}
				}
		}
		
		this.remain = this.arrSharps.length;
		for(var i = 1; i <= this.mapY; i ++){
			for(var j = 1; j <= this.mapX; j ++){
				this.arrBlocks.push(new Block(j, i));
			}
		}	
		this.setImages();
	},
	setImages: function(){
		var c = 0, b;
		this.arrSharps = this.randomArr(this.arrSharps);
		for(var i = 1; i <= this.mapY; i ++){
			for(var j = 1; j <= this.mapX; j ++){
				b = this.findBlock(j, i);
				if(b.setImg(this.arrSharps[c])){
					c ++;
				}
			}
		}
	},
	clickNode: function(b){
		if (b.i == 0) return;
		
		if(this.checkBlock){
			$(this.checkBlock.img).style.border = "0px";
			if(b.id == this.checkBlock.id){
				this.checkBlock = null;
				this.sound(2);
				return;
			}
			if(b.i == this.checkBlock.i){
				if(this.find_path(this.checkBlock, b)){
					this.del(this.checkBlock, b);
					this.checkBlock = null;
					return;
				}
			}
		}
		this.sound(2);
		this.checkBlock = b;
		this.choose(b);
	},
	choose: function(b){
		var img = $(b.img);
		img.style.height = "38px";
		img.style.width = "43px";
		img.style.border = "1px solid #00FFFF";
	},
	cross: function(x, y){
		for(var x1 = x - 1; x1 > 0; x1 --){
			var b = this.findBlock(x1, y);
			if(b.i != 0){
				break;
			}
		}		
		for(var x2 = x + 1; x2 < this.mapX + 1; x2 ++){			
			var b = this.findBlock(x2, y);
			if(b.i != 0){
				break;
			}
		}		
		for(var y1 = y - 1; y1 > 0; y1 --){		
			var b = this.findBlock(x, y1);
			if(b.i != 0){
				break;
			}
		}		
		for(var y2 = y + 1; y2 < this.mapY + 1; y2 ++){
			var b = this.findBlock(x, y2);
			if(b.i != 0){
				break;
			}
		}
		if(x1 == 0){
			x1 = -1;
		}
		if(x2 == this.mapX + 1){
			x2 = this.mapX + 3;
		}
		if(y1 == 0){
			y1 = -1;
		}
		if(y2 == this.mapY + 1){
			y2 = this.mapY + 3;
		}
		return {x1: x1, x2: x2, y1: y1, y2: y2};
	},
	passx: function(x1,x2,y){
		if(x1 < x2){
			while (++x1 < x2){
				var b = this.findBlock(x1, y);
				if(b && b.i != 0){
					return false;
				}
			}
		} else {
			while (++x2 < x1){
				var b = this.findBlock(x2, y);
				if(b && b.i != 0){
					return false;
				}
			}
		}
		return true;
	},
	passy: function(y1,y2,x){
		if (y1 < y2) {
			while (++y1 < y2){
				var b = this.findBlock(x, y1);
				if(b && b.i != 0){
					return false;
				}
			}
		} else {
			while (++y2 < y1){
				var b = this.findBlock(x, y2);
				if(b && b.i != 0){
					return false;
				}
			}
		}
		return true;
	},
	linex: function(x1, x2, y){
		var path = [];
		if(x1 < x2){
			while (x1++ < x2)
				path.push('<img src="' + this.img_path + 'linex.gif?' + new Date() + '" style="position:absolute;left:'+(x1*this.node_width-20)+'px;top:'+y*this.node_height+'px;width:46px;height:41px;">');
		} else {
			while (x2++ < x1)
				path.push('<img src="' + this.img_path + 'linex.gif?' + new Date() + '" style="position:absolute;left:'+(x2*this.node_width-20)+'px;top:'+y*this.node_height+'px;width:46px;height:41px;">');
		}
		return path;
	},
	liney: function(y1, y2, x){
		var path = [];
		if(y1 < y2){
			while (y1++ < y2)
				path.push('<img src="' + this.img_path + 'liney.gif" style="position:absolute;left:'+x*this.node_width+'px;top:'+(y1*this.node_height-20)+'px;width:46px;height:41px;">');
		} else {
			while (y2++ < y1)
				path.push('<img src="' + this.img_path + 'liney.gif" style="position:absolute;left:'+x*this.node_width+'px;top:'+(y2*this.node_height-20)+'px;width:46px;height:41px;">');
		}
		return path;
	},
	find_path: function(b1, b2){
		var sx = b1.x;
		var sy = b1.y;
		var ex = b2.x;
		var ey = b2.y;
		
		var s = this.cross(sx, sy);
		if(sy == ey && s.x1 <= ex && ex <= s.x2){
			this.path = this.linex(sx, ex, sy);
			return true;
		}
		if(sx == ex && s.y1 <= ey && ey <= s.y2){
			this.path = this.liney(sy, ey, sx);
			return true;
		}
		var e = this.cross(ex, ey);
			
		var x1 = s.x1 < e.x1 ? e.x1 : s.x1;
		var x2 = s.x2 > e.x2 ? e.x2 : s.x2;
		var y1 = s.y1 < e.y1 ? e.y1 : s.y1;
		var y2 = s.y2 > e.y2 ? e.y2 : s.y2;
		
		if (x1 < sx && sx < x2 && y1 < ey && ey < y2){
			this.path = this.liney(sy, ey, sx).concat(this.linex(sx, ex, ey));
			return true;
		}
		if (x1<ex && ex<x2 && y1<sy && sy<y2){
			this.path = this.liney(sy, ey, ex).concat(this.linex(sx, ex, sy));
			return true;
		}
		if (sx < ex){
			var x3 = sx;
			var x4 = ex;
			var s1 = sy;
			var e1 = ey;
		} else {
			var x3 = ex;
			var x4 = sx;
			var s1 = ey;
			var e1 = sy;
		}
		for(var x = x3 + 1; x < x4; x ++){
			if(x1 < x && x < x2 && this.passy(s1, e1, x)){
				this.path = this.liney(s1, e1, x).concat(this.linex(x3, x, s1), this.linex(x, x4, e1));
				return true;
			}
		}
		if(sy < ey){
			var y3 = sy;
			var y4 = ey;
			var s2 = sx;
			var e2 = ex;
		} else {
			var y3 = ey;
			var y4 = sy;
			var s2 = ex;
			var e2 = sx;
		}
		for (var y = y3 + 1; y < y4; y ++){
			if (y1 < y && y < y2 && this.passx(s2, e2, y)){
				this.path = this.linex(s2, e2, y).concat(this.liney(y3, y, s2), this.liney(y, y4, e2));
				return true;
			}
		}
		s1 = true;
		e1 = true;
		s2 = true;
		e2 = true;
		while (s1 || e1 || s2 || e2){
			if(s1){
				if(x1 < --x3 && x3 < x2){
					if (this.passy(sy, ey, x3)){
						this.path = this.liney(sy, ey, x3).concat(this.linex(x3, sx, sy), this.linex(x3, ex, ey));
						return true;
					}
				} else {
					s1 = false;
				}
			}
			if (e1){
				if (x1 < ++x4 && x4 < x2){
					if (this.passy(sy, ey, x4)){
						this.path = this.liney(sy, ey, x4).concat(this.linex(x4, sx, sy), this.linex(x4, ex, ey));
						return true;
					}
				} else {
					e1 = false;
				}
			}
			if (s2){
				if (y1 < --y3 && y3 < y2){
					if (this.passx(sx, ex, y3)){
						this.path = this.linex(sx, ex, y3).concat(this.liney(y3, sy, sx), this.liney(y3, ey, ex));
						return true;
					}
				} else {
					s2 = false;
				}
			}
			if (e2){
				if (y1 < ++y4 && y4 < y2){
					if (this.passx(sx, ex, y4)){
						this.path = this.linex(sx, ex, y4).concat(this.liney(y4, sy, sx), this.liney(y4, ey, ex));
						return true;
					}
				} else {
					e2 = false;
				}
			}
		}
		return false;
	},
	del: function(b1, b2){
		var cx = b1.x;
		var cy = b1.y;
		var px = b2.x;
		var py = b2.y;
		
		this.remain -= 2;
		this.addTime();
		
		this.score += 10;
		this.update_score();
		
		for(var j = 0, l = this.arrSharps.length; j < l; j ++){
			if(this.arrSharps[j] == b1.i){
				this.arrSharps.splice(j, 1);
				break;
			}
		}
		for(; j < l - 1; j ++){
			if(this.arrSharps[j] == b1.i){
				this.arrSharps.splice(j, 1);
				break;
			}
		}
		b1.i = 0;
		b2.i = 0;
			
		this.sound(3);
		
		this.dPath.style.display = "";
		this.path.push('<img src="' + this.img_path + 'del.gif?' + new Date() + '" style="position:absolute;left:'+cx*this.node_width+'px;top:'+(cy*this.node_height)+'px;width:43px;height:38px;z-index:1;">');
		this.path.push('<img src="' + this.img_path + 'del.gif?' + new Date() + '" style="position:absolute;left:'+px*this.node_width+'px;top:'+(py*this.node_height)+'px;width:43px;height:38px;z-index:1;">');
		this.dPath.innerHTML = this.path.join("");
		this.path = [];
		
		var self = this;
		clearTimeout(this.timer);
		this.timer = setTimeout(function(){
				self.dPath.style.display = "none";
				self.dPath.innerHTML = '';
			}, 300);
		
		b1.elem.innerHTML = '';
		b2.elem.innerHTML = '';
		
		this.move_as_level(cx, cy, px, py);
		
		if(this.remain){
			while(!this.next_double()){
				this.resetMap();
			}
		} else {
			setTimeout("llk.success()",600);
		}
	},
	next_double: function(){
		for(var i = 1;i <= this.mapY; i ++){
			for(var j = 1;j <= this.mapX; j ++){
				var b = this.findBlock(j, i);
				if(b.i != 0){
					var next_node = this.find_next(b);
					if(next_node){
						return [b, next_node];
					}
				}
			}
		}
		return false;
	},
	find_next: function(bF){
		var arrSame = [];
		for(var i = 1; i <= this.mapY; i ++){
			for(var j = 1; j <= this.mapX; j ++){
				var b = this.findBlock(j, i);
				if(b.id != bF.id && b.i == bF.i && this.find_path(b, bF)){
					return b;
				}
			}
		}
		return false;
	},
	move_to_left: function(y, from){
		var arrTemp = [];
		var t = (from=="center")? 8 : 15;
		for(var j = 1; j < t; j ++){
			var b = this.findBlock(j, y);
			if(b.i != 0){
				arrTemp.push(b.i);
			}
			b.i = 0;
			b.elem.innerHTML = '';
		}
		for(var j = 1, l = arrTemp.length; j <= l; j ++){
			var b = this.findBlock(j, y);
			b.i = arrTemp[j - 1];
			b.elem.innerHTML = '<img alt="img_' + y + '_' + j + '" id="img_' + y + '_' + j + '" src="' + this.img_path + b.i + '.gif" style="width:43px;height:38px;">';
			b.bind();
		}
	},
	move_to_right: function(y, from){
		var arrTemp = [];
		var t = (from=="center")? 7 : 0;
		for(var j = 14; j > t; j --){
			var b = this.findBlock(j, y);
			if(b.i != 0){
				arrTemp.push(b.i);
			}
			b.i = 0;
			b.elem.innerHTML = '';
		}
		for(var j = 14, l = 14 - arrTemp.length; j > l; j --){
			var b = this.findBlock(j, y);
			b.i = arrTemp[14 - j];
			b.elem.innerHTML = '<img alt="img_' + y + '_' + j + '" id="img_' + y + '_' + j + '" src="' + this.img_path + b.i + '.gif" style="width:43px;height:38px;">';
			b.bind();
		}
	},
	move_to_top: function(x, from){
		var arrTemp = [];
		var t = (from=="center")? 6 : 11;
		for(var i = 1; i < t; i ++){
			var b = this.findBlock(x, i);
			if(b.i != 0){
				arrTemp.push(b.i);
			}
			b.i = 0;
			b.elem.innerHTML = '';
		}
		for(var i = 1, l = arrTemp.length; i <= l; i ++){
			var b = this.findBlock(x, i);
			b.i = arrTemp[i - 1];
			b.elem.innerHTML = '<img alt="img_' + i + '_' + x + '" id="img_' + i + '_' + x + '" src="' + this.img_path + b.i + '.gif" style="width:43px;height:38px;">';
			b.bind();
		}
	},
	move_to_bottom: function(x, from){
		var arrTemp = [];
		var t = (from=="center")? 5 : 0;
		for(var i = 10; i > t; i --){		
			var b = this.findBlock(x, i);
			if(b.i != 0){
				arrTemp.push(b.i);
			}
			b.i = 0;
			b.elem.innerHTML = '';
		}
		for(var i = 10, l = 10 - arrTemp.length; i > l; i --){
			var b = this.findBlock(x, i);
			b.i = arrTemp[10 - i];
			b.elem.innerHTML = '<img alt="img_' + i + '_' + x + '" id="img_' + i + '_' + x + '" src="' + this.img_path + b.i + '.gif" style="width:43px;height:38px;">';
			b.bind();
		}
	},
	move_as_level: function(cx, cy, px, py){
		var arrTemp;
		switch(this.level){
			case 1:
				break;
			case 2:
				break;
			case 3:
				this.move_to_top(cx, "center");
				this.move_to_top(px, "center");
				this.move_to_bottom(cx, "center");
				this.move_to_bottom(px, "center");
				break;
			case 4:
				this.move_to_left(cy, "center");
				this.move_to_left(py, "center");
				this.move_to_right(cy, "center");
				this.move_to_right(py, "center");
				break;
			case 5:
				this.move_to_left(cy, "right");
				this.move_to_left(py, "right");
				break;
			case 6:
				this.move_to_right(cy, "left");
				this.move_to_right(py, "left");
				break;
			default:
		}
	},
	update_level: function(){
		this.dLevel.innerHTML = this.level;
	},
	update_score: function(){
		this.dScore.innerHTML = this.score;
	},
	randomArr: function(arr){
		var rnd = []
		while (arr.length){
			rnd = rnd.splice(0,Math.floor(Math.random()*(rnd.length+1))).concat(arr.splice(Math.floor(Math.random()*arr.length),1),rnd);
		}
		return rnd;
	},
	showPanel: function(layName){
		if(this.lastPanel){
			this.lastPanel.style.display = "none";
		}
		this.lastPanel = $(layName);
		this.lastPanel.style.display = "";
	},
	addTime: function(){	
		var counts = this.dTimeCount.width;
		if(this.dTimeCount.width < 447){
			this.dTimeCount.width += 3;
		}
		if(counts > 350){
			this.dTimeCount.src = this.img_path + "count1.gif";
		} else if(counts > 220 && counts <= 350) {
			this.dTimeCount.src = this.img_path + "count2.gif";
		} else if(counts > 120 && counts <= 220) {
			this.dTimeCount.src = this.img_path + "count3.gif";
		} else if(counts > 35 && counts <= 120) {
			this.dTimeCount.src = this.img_path + "count4.gif";	
		} else if(counts > 20 && counts <= 35) {
			this.dTimeCount.src = this.img_path + "count5.gif";	
		} else if(counts < 20) {
			this.dTimeCount.src = this.img_path + "count6.gif";
		}
	},
	initTimeCount: function(){		
		this.dTimeCount.src = this.img_path + "count1.gif";
		this.dTimeCount.width = 450;
		this.dTimeCount.height = 13;
	},
	count: function(){
		clearInterval(this.timeid);
		var self = this;
		this.timeid = setInterval(function(){
			var counts = self.dTimeCount.width;
			self.dTimeCount.width = counts-1;
			switch (counts){
				case 350:
					self.dTimeCount.src = self.img_path + "count2.gif";
					break;
				case 220: 
					self.dTimeCount.src = self.img_path + "count3.gif";
					break;
				case 120: 
					self.dTimeCount.src = self.img_path + "count4.gif";
					break;
				case  35:
					self.dTimeCount.src = self.img_path + "count5.gif";
					break;
				case  20:
					self.dTimeCount.src = self.img_path + "count6.gif";
			}
			if (counts < 2){
				self.over();
			}
		}, 500)
	},
	sound: function(id){
		try{
			au_sound.GotoFrame(0);
			au_sound.GotoFrame(id);
			au_sound.Play();
		} catch(err) {
		}
	}
};

window.onload = function(){
	llk.init();
}