const FakeProgress = require('..');
const util = require('util');
const EventEmitter = require('events');

const a = function (cb) {
	setTimeout(() => {
		cb();
	}, 1000);
};

const c = function (cb) {
	setTimeout(() => {
		cb();
	}, 3000);
};

const B = function () {
	EventEmitter.call(this);

	let count = 0;
	const self = this;
	const totalCount = 30;
	self.emit('start', count / totalCount);
	self._intervalId = setInterval(() => {
		count++;
		if (count >= totalCount) {
			self.emit('end', count / totalCount);
			clearInterval(self._intervalId);
		} else {
			self.emit('progress', count / totalCount);
		}
	}, 100);
};

util.inherits(B, EventEmitter);

const p = new FakeProgress({});

const onEachDeciSecond = function () {
	console.log('Progress is ' + (p.progress * 100).toFixed(1) + ' %');
};

onEachDeciSecond();

const interval = setInterval(onEachDeciSecond, 100);

const aProgress = p.createSubProgress({
	timeConstant: 500,
	end: 0.3,
	autoStart: true
});

a(err => {
	if (err) {
		throw (err);
	}
	aProgress.stop();
	const bProgress = p.createSubProgress({
		end: 0.8
	});
	const b = new B();

	b.on('progress', progress => {
		bProgress.setProgress(progress);
	});

	b.on('end', () => {
		bProgress.stop();
		const cProgress = p.createSubProgress({
			timeConstant: 1000,
			autoStart: true
		});
		c(() => {
			cProgress.end();
			onEachDeciSecond();
			clearInterval(interval);
		});
	});
});
