(function () {
	var CONST_MUSIC_SRC_ARRAY = ["music/1.mp3", "music/2.mp3"];
	var audioPlayer = {
		musicsrc : CONST_MUSIC_SRC_ARRAY,
		currentPlayIndex : 0,
		audioObj : null,
		getAudioObj : function(){
			if(!this.audioObj){
				this.audioObj = document.createElement("audio");
				document.body.appendChild(this.audioObj);
			}
		},
		start : function(){
			if(!this.audioObj)
				this.getAudioObj();
			this.audioObj.src = this.musicsrc[this.currentPlayIndex];
			var that = this;
			this.audioObj.play();
			this.audioObj.addEventListener('ended', function() {
    			this.currentTime = 0;
    			this.src = that.getNextMusic();
    			this.play();
			}, false);
		},
		getNextMusic : function(){
			if(this.currentPlayIndex == this.musicsrc.length - 1)
				this.currentPlayIndex = 0;
			else
				this.currentPlayIndex++;
			return this.musicsrc[this.currentPlayIndex];
		}
	};
	window.audioPlayer = audioPlayer;
})();
