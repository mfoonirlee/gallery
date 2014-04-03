var ready = (function(){
	var funcs = [];
	var ready = false;

	function handler(e){
		//如果已经准备就绪,返回
		if(ready)
			return;
		//如果状态不为complete,返回
		if(e.type === "readystatechange" && document.readyState !== "complete")
			return;
		for(var i = 0; i < funcs.length; i++)
			funcs[i].call(document);
		ready = true;
		funcs = null;
	}

	if(document.addEventListener){
		document.addEventListener("DOMContentLoaded", handler, false);
		document.addEventListener("readystatechange", handler, false);
		window.addEventListener("load", handler, false);//为了兼容那些不支持上述事件的浏览器
	}
	else if(document.attachEvent){
		document.attachEvent("onreadystatechange", handler);
		window.attachEvent("onload", handler);
	}
	return function whenready(f){
		if(ready)
			f.call(document);
		else
			funcs.push(f);
	}

})();

(function(){
	var ImgShower = function(list){
		this.imgList = list;
		this.loadNum = 0;
		this.MaxHeight = 300;
		this.displayer = document.getElementById("wall");
		this.imgClassName = "img-wall";
		this.imgArr = [];
		this.idNum = 0;
		this.displayMode = "wall";
		this.watcher = null;
		this.MAX_HEIGHT = 800;
		//自动翻页的间隔
		this.trunPageInterval = 6000;
		//计时器
		this.timer = -1;
	}

	/*
	* @describe : 加载图片
	*/
	ImgShower.prototype.loadImg = function(url) {
		var img = document.createElement("img");
		img.src = url;
		var that = this;
		img.onload = function(){
			that.loadNum++;
			that.imgArr.push(this);
			var per = 1;
			if(this.height > that.MAX_HEIGHT)
			{
				per = this.height / that.MAX_HEIGHT;
				this.oriHeight = that.MAX_HEIGHT;
				this.oriWidth = Math.floor(this.width / per);
			}	
			else
			{
				this.oriWidth = this.width;
				this.oriHeight = this.height;	
			}
			
			if(this.height < that.MaxHeight)
				that.MaxHeight = this.height;
			if(that.loadNum == that.imgList.length)
				that.setImg();
		}
	};
	/*
	* @describe : 设置对象中的img样式
	*/
	ImgShower.prototype.setImg = function() {
		var img, oriScale, w, h;
		for(var i = 0; i < this.loadNum; i++) {
			img = this.imgArr[i];
			oriScale = img.width/img.height;
			w = img.width;
			h = img.height;
			img.id = "img_" + this.idNum++;
			if(h > this.MaxHeight)
			{
				h = this.MaxHeight;
				w = Math.floor(this.MaxHeight * oriScale);
			}
			img.style.width = w + "px";
			img.style.height = h + "px";
			img.className = this.imgClassName;
			img.imgs = this;
			img.onclick = function(){
				this.imgs.changeMode(this.id);
			};
			this.add(this.displayer, img);
		}
	};
	/**
	* @describe : 向target 添加元素
	* @param : Element target
	* @param : object
	*/
	ImgShower.prototype.add = function(target, obj) {
		if(!target || !(target instanceof Element) || !obj)
			return;
		target.appendChild(obj);
	};
	/**
	* describe :初始化
	*/
	ImgShower.prototype.init = function() {
		var len = this.imgList.length;

		for(var i = 0; i < len; i++){
			this.loadImg(this.imgList[i], this.setImg);
		}
	};
	/*
	* @describe : 切换显示模式
	* @param : chooeseid
	*/
	ImgShower.prototype.changeMode = function(id) {
		if(this.displayMode == 'wall'){
			this.displayMode = 'watcher';
			p("wall").style.display = 'none';
			p("watcher").style.display = 'block';
			this.showWatcher(id);
		}
		else{
			this.displayMode = 'wall';
			p("wall").style.display = 'block';
			p("watcher").style.display = 'none';
		}

	};
	/*
	* @describe : 展示某个单图
	* @param : 当前图片的id
	*/
	ImgShower.prototype.showWatcher = function(imgId){
		var img = p(imgId),
			imgDisplay = p("mainWatcher");
		imgDisplay.src = img.src;
		this.watcher = imgId;
		imgDisplay.parentNode.style.width = img.oriWidth + "px";
		imgDisplay.parentNode.style.height = img.oriHeight + "px";
		imgDisplay.parentNode.className = "animate" + Math.ceil(Math.random() * 9);
		var stage = p("stage");
		if(stage.offsetHeight < img.oriHeight + 100)
		stage.style.height = img.oriHeight + 100 + "px"; 
	}
	window.p = function(id){
		return document.getElementById(id);	
	} 
	window.ImgShower = ImgShower;

})();

ready(function(){
	var singleImg = function(list){
		if(this._instance)
			return this._instance;

		this._instance = new ImgShower(list);
		return _instance;	
	};

	//图片数量
	var CONST_SIZE = 63,imgArr = [];
	for(var i = 1; i <= CONST_SIZE; i++){
		imgArr.push("image/sensen/1 (" + i + ").jpg");
	}
	var imgs = singleImg(imgArr);
	
	window.start = function(){
		p("titleContent").style.display = "none";
		p("wall").style.display = "block";
		imgs.init();
		setTimeout(function(){
			getFlowerSnow().init();
		}, 6000);
	};
	window.imgs = imgs;
	window.returnWall = function(){
		imgs.changeMode();	
	} 
	window.prevPage = function(){
		var id = imgs.watcher;
			num = id.split("_")[1];
		if(num == 0)
			num = imgs.imgList.length;
		imgs.showWatcher("img_" + --num);
	};
	window.nextPage = function(){
		var id = imgs.watcher;
			num = id.split("_")[1];
		if(num == imgs.imgList.length - 1)
			num = 0;
		imgs.showWatcher("img_" + ++num);
		imgs.t1 = (new Date()).getTime();
		if(imgs.timer < 0){
			imgs.t1 = (new Date()).getTime();
			imgs.timer = setInterval(function(){
				imgs.t2 = (new Date()).getTime();
				if(imgs.t2 - imgs.t1 > imgs.trunPageInterval)
				{
					nextPage();
					imgs.t1 = imgs.t2;
				}
				
				},this.trunPageInterval);
		}
	};
	document.addEventListener("keydown", function(e){
		if(imgs.displayMode == "wall")
			return;
		if(e.keyCode == 27)
			imgs.changeMode();
		else if(e.keyCode == 37)
			prevPage();
		else if(e.keyCode == 39)
			nextPage();
	});
});


