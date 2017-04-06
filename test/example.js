var FakeProgress = require("..");

// Create the fake progress with a timeConstant of 10 seconds
// it means that :
//  after 10 seconds, progress will be 0.6321 ( = 1-Math.exp(-1) )
//  after 20 seconds, progress will be 0.8646 ( = 1-Math.exp(-2) )
//  and so one
var p = new FakeProgress({
  timeConstant : 10000,
  autoStart : true
});

var exampleAsyncFunction = function(callback){
  setTimeout(function(){
    callback()
  },30000)
};

var onEachSecond = function(){
  console.log("Progress is "+(p.progress*100).toFixed(1)+" %");
};

var interval = setInterval(onEachSecond, 1000);

var onEnd = function(){
  p.end();
  clearInterval(interval);
  console.log("Ended. Progress is "+(p.progress*100).toFixed(1)+" %")
};

exampleAsyncFunction(onEnd);
