var s = {
	d: [
		'我们不需要把生活弄得复杂，因为它本身就已经很复杂了。',
		'我不希望别人猜我的心思，别人问我，我就直接了当地回答，不给别人乱想的机会。我只觉得人生简单些更好，不需要把一切搞得复杂。——秋水：<a href="http://www.xiaoqiushui.com/archives/5348" target="_blank">给“想”一个边界</a>',
		'很多事，不是你做不了，是因为你没有花费时间和精力去投入的做。就像你最爱看的漫画一样那么的投入。就像你最爱读的小说那样的投入。或许，没用多久那些困扰你的事情便不再了。',
		'假如我们把自己力所能及的事都完成了，我们会真的令自己大吃一惊。',
		'人生中有些事是不得不做的，于不得不做中勉强去做，是毁灭；于不得不做中做的好，是勇敢。',
		'鸡蛋，从外打破是食物，从内打破是生命。人生亦是，从外打破是压力，从内打破是成长。',
		'我们花我们未拥有的钱，去买一些我们不需要的东西，就为了使无关紧要的人对我们印象深刻。 ——威尔·史密斯',
		'力量，来自你把注意力放在你拥有的资源上；无力感，来自把注意力移到本人没有的资源上。——李中莹',
		'有一条恶龙，每年要求村庄献祭一个处女，每年这个村庄都会有一个少年英雄去与恶龙搏斗，但无人生还。又一个英雄出发时，有人悄悄尾随。龙穴铺满金银财宝， 英雄用剑刺死恶龙，然后坐在尸身上，看着闪烁的珠宝，慢慢地长出鳞片、尾巴和触角，最终变成恶龙。——《在缅甸寻找奥威尔》',
		'人不要太任性，因为你是活给未来的你。不要让未来的你讨厌现在的你。',
		'真正的平静，不是避开车马喧嚣，而是在心中修篱种菊。',
		'困是最好的床，饿是最好的菜。寂寞是最好的姑娘。——@NiZn',
		'友谊和花香一样，还是淡一点的比较好，越淡的香气越使人依恋，也越能持久。',
		'人生最甜蜜的欢乐，都是忧伤的果实；人生最纯美的东西，都是从苦难中得来的。我们要亲身经历艰难，然后才懂得怎样去安慰别人。——《桃姐》',
		'世间事，除了生死，哪一桩不是闲事。 ——仓央嘉措',
		'人活在世上，就是为了忍受摧残，一直到死。想明了这一点，一切都能泰然处之。——王小波《黄金时代》',
		'生活中其实没有绝境，绝境在于你自己的心没有打开。',
		'有人尖刻的嘲讽你，你马上尖酸的回敬他。有人毫无理由的看不起你，你马上轻蔑的鄙视他。有人在你面前大肆炫耀，你马上加倍证明你更厉害。有人对你冷漠，你马上对他冷淡疏远。看，你讨厌的那些人，轻易就把你变成你自己最讨厌的那种样子。这才是“敌人”对你最大的伤害。',
		'真正的自由是在无所依傍之时，发现无路而处处是路。能行到水穷处，坐看云起时的人才算得上自由。这不是路的缘故，是心路。',
		'坚持是一种可贵的品质，但是如果坚持了错的方向，那么勇于放下、改变也是一种智慧！',
		'立志用功如种树然，方其根芽，犹未有干；及其有干，尚未有枝；枝而后叶，叶而后花。 ——王守仁',
		'做人的最高境界不是一味低调，也不是一味张扬，而是始终如一的不卑不亢。',
		'人的眼睛是由黑、白两部分所组成的，可是神为什么要让人只能通过黑的部分去看东西？ 因为人生必须透过黑暗，才能看到光明。——《塔木德》',
		'记住：在您“袖手旁观”时，其他那些觉得自己必须一天不拉地忙于交易的投机者正在为您的下一次冒险活动铺垫基础。您将从他们的错误中获得利益。',
		'不甘心就不要放弃啊，看不过去就起来改变啊。要嘛就证明自己的能力，要嘛就闭嘴接受现实。所有好走的路都是下坡，失败是可以接受的，但是没有试图奋斗过的失败是没有借口的零分。——《胜女的代价》'
	],
	i: function(){		
		var l = this.d.length;
		$('#wel').html(this.d[parseInt(Math.random() * l, 10)]);
	}
};

$(document).ready(function(){
	s.i();
});

function loadready(){
	var w = $(window).width();
	if(w > 1320){
		$('#Container').css('width', '1320px');
	} else if(w > 1060){
		$('#Container').css('width', '1060px');
	} else if(w > 800){
		$('#Container').css('width', '800px');
	} else if(w > 540){
		$('#Container').css('width', '540px');
	} else {
		$('#Container').css('width', '280px');
	}
}

$('#wall').imagesLoaded(function(){
	loadready();
	$('#wall').show();
	$('#wall').masonry({
		itemSelector: '.col',
		columnWidth: 260
	});
});

$(window).resize(function(){
	loadready();
});