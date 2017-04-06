var FakeProgress = require("..");
var util = require("util");
const EventEmitter = require('events');

var a = function(cb){
	setTimeout(function(){
		cb()
	},1000)
};

var c = function(cb){
	setTimeout(function(){
		cb()
	},3000)
};

const B = function(){
	EventEmitter.call(this);

	var count = 0;
	var self = this;
	var totalCount = 30;
	self.emit('start', count/totalCount);
	self._intervalId = setInterval(function(){
		count ++;
		if(count >= totalCount){
			self.emit('end', count/totalCount);
			clearInterval(self._intervalId);
		} else {
			self.emit('progress', count/totalCount);
		}
	}, 100)
};

util.inherits(B, EventEmitter);


var p = new FakeProgress({});

var aProgress = p.createSubProgress({
	timeConstant : 500,
	end : 0.3,
	autoStart : true
});
var onEachDeciSecond = function(){
  console.log("Progress is "+(p.progress*100).toFixed(1)+" %");
};
onEachDeciSecond()
var interval = setInterval(onEachDeciSecond, 100);
a(function(err){
	if(err){
		throw(err)
	}
	aProgress.stop();
	var bProgress = p.createSubProgress({
		end : 0.8
	});
	var b = new B();

	b.on('progress', function(progress){
		bProgress.setProgress(progress);
	});

	b.on('end', function(){
		bProgress.stop();
		var cProgress = p.createSubProgress({
			timeConstant : 1000,
			autoStart : true
		});
		c(function(){
			cProgress.end()
      onEachDeciSecond()
      clearInterval(interval);
		})
	});
});
