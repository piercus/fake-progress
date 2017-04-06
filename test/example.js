const FakeProgress = require('..');

// Create the fake progress with a timeConstant of 10 seconds
// it means that :
//  after 10 seconds, progress will be 0.6321 ( = 1-Math.exp(-1) )
//  after 20 seconds, progress will be 0.8646 ( = 1-Math.exp(-2) )
//  and so one
const p = new FakeProgress({
	timeConstant: 10000,
	autoStart: true
});

const exampleAsyncFunction = function (callback) {
	setTimeout(() => {
		callback();
	}, 30000);
};

const onEachSecond = function () {
	console.log('Progress is ' + (p.progress * 100).toFixed(1) + ' %');
};

const interval = setInterval(onEachSecond, 1000);

const onEnd = function () {
	p.end();
	clearInterval(interval);
	console.log('Ended. Progress is ' + (p.progress * 100).toFixed(1) + ' %');
};

exampleAsyncFunction(onEnd);
