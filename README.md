# Fakeprogress

Simulate smooth progression easily and combine real progression and fake progression.

## Basic example

```
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
```

will print

```
Progress is 8.6 %
Progress is 17.3 %
Progress is 25.2 %
Progress is 32.3 %
Progress is 38.7 %
Progress is 44.6 %
Progress is 49.8 %
Progress is 54.6 %
Progress is 58.9 %
Progress is 62.8 %
Progress is 66.4 %
Progress is 69.6 %
Progress is 72.5 %
Progress is 75.1 %
Progress is 77.5 %
Progress is 79.6 %
Progress is 81.5 %
Progress is 83.3 %
Progress is 84.9 %
Progress is 86.3 %
Progress is 87.6 %
Progress is 88.8 %
Progress is 89.9 %
Progress is 90.8 %
Progress is 91.7 %
Progress is 92.5 %
Progress is 93.2 %
Progress is 93.9 %
Progress is 94.4 %
Ended. Progress is 100.0 %
```

The chart of progression over time.

[!alt](./example.png)

Until the end is triggered, the progression is following the exponential curve, once "end" is triggered, progression goes to 100%.

## More complex

In this example we will mix 3 functions, A and C are classical async functions, B is an async function with a 'real' callback.

```

```
