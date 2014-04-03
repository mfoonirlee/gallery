(function () {
	var CONST_SPEED_MIN = 1,
		CONST_SPEED_MAX = 10,
		CONST_FLOWER_CLASSNAME = "flower",
		CONST_LIMIT_HEIGHT = 800,
		CONST_MIN_HEIGHT = 200,
		CONST_INTERVAL_TIME = 100,
		CONST_FLOWER_SRC = "image/2006819224938886.GIF",
		CONST_FLOWER_NUM = 100,
		CONST_STAGE_NAME = "stage";

	var FlowerSnow = function(num, stage){
		this.flowerNum = num;
		this.stage = stage;
		this.flowerArray = [];
		this.interval = 0;
		this.intervalTime = CONST_INTERVAL_TIME;
	}
	FlowerSnow.prototype.init = function() {
		var w = stage.offsetWidth, h = stage.offsetHeight;
		for(var i = 0;i < this.flowerNum; i++){
			var f = new Flower(w, h);
			this.flowerArray.push(f);
			f.add(this.stage);
		}
		this.start();
	};
	FlowerSnow.prototype.start = function(){
		this.interval = setInterval(function(){
			var f = getFlowerSnow();
			var len = f.flowerArray.length;
			for(var i = 0; i < len; i++){
				f.flowerArray[i].move();
			}
		}, this.intervalTime)
	}

	var Flower = function(w, h){
		var dire = Math.random() * 2 > 1 ? 1 : -1;
		this.speedX = dire * Math.floor(CONST_SPEED_MIN + Math.random() * (CONST_SPEED_MAX - CONST_SPEED_MIN));
		this.speedY = Math.floor(CONST_SPEED_MIN + Math.random() * (CONST_SPEED_MAX - CONST_SPEED_MIN));
		this.img = document.createElement("img");
		this.img.className = CONST_FLOWER_CLASSNAME;
		this.img.src = CONST_FLOWER_SRC;
		Flower.w = w;
		Flower.h = h;
		this.x = Math.floor(Math.random() * w); 
		this.y = Math.floor(-Math.random() * CONST_LIMIT_HEIGHT) - CONST_MIN_HEIGHT;
	}
	Flower.prototype.move = function(){
		if(this.x > Flower.w)
			this.speedX *= -1;
		else if(this.x < 0)
			this.speedX *= -1;
		if(this.y > Flower.h)
			this.y = -CONST_LIMIT_HEIGHT;
		this.x += this.speedX;
		this.y += this.speedY;
		this.img.style.left = this.x + "px";
		this.img.style.top = this.y + "px";
	}
	Flower.prototype.add = function(target){
		if(!target || !this.img)
			return;
		target.appendChild(this.img);
	}

	function getFlowerSnow(){
		if(!this.F)
			this.F = new FlowerSnow(CONST_FLOWER_NUM, document.getElementById(CONST_STAGE_NAME));
		return this.F;
	}
	window.getFlowerSnow = getFlowerSnow;
})();
