/**
 * Represents a fakeProgress
 * @constructor
 * @param {object} options - options of the contructor
 * @param {object} [options.timeConstant=1000] - the timeConstant in milliseconds (see https://en.wikipedia.org/wiki/Time_constant)
 * @param {object} [options.autoStart=false] - if true then the progress auto start
 */

const FakeProgress = function (opts) {
	if (!opts) {
		opts = {};
	}

	this.timeConstant = opts.timeConstant || 1000;
	this.progress = 0;
	this._running = false;
	this._intervalFrequency = 100;
	this.autoStart = opts.autoStart || false;
	this.parent = opts.parent;
	this.parentStart = opts.parentStart;
	this.parentEnd = opts.parentEnd;
	if (this.autoStart) {
		this.start();
	}
};

/**
 * Start fakeProgress instance
 * @method
 */

FakeProgress.prototype.start = function () {
	this._time = 0;
	this._intervalId = setInterval(this._onInterval.bind(this), this._intervalFrequency);
};

FakeProgress.prototype._onInterval = function () {
	this._time += this._intervalFrequency;
	this.setProgress(1 - Math.exp(-1 * this._time / this.timeConstant));
};

/**
 * Stop fakeProgress instance and set progress to 1
 * @method
 */

FakeProgress.prototype.end = function () {
	this.stop();
	this.setProgress(1);
};

/**
 * Stop fakeProgress instance
 * @method
 */

FakeProgress.prototype.stop = function () {
	clearInterval(this._intervalId);
	this._intervalId = null;
};

/**
 * Create a sub progress bar under the first progres
 * @method
 * @param {object} options - options of the FakeProgress contructor
 * @param {object} [options.end=1] - the progress in the parent that correspond of 100% of the child
 * @param {object} [options.start=fakeprogress.progress] - the progress in the parent that correspond of 0% of the child
 */

FakeProgress.prototype.createSubProgress = function (opts) {
	const parentStart = opts.start || this.progress;
	const parentEnd = opts.end || 1;
	const options = Object.assign({}, opts, {
		parent: this,
		parentStart: parentStart,
		parentEnd: parentEnd,
		start: null,
		end: null
	});

	const subProgress = new FakeProgress(options);
	return subProgress;
};

/**
 * SetProgress of the fakeProgress instance and updtae the parent
 * @method
 * @param {number} progress - the progress
 */

FakeProgress.prototype.setProgress = function (progress) {
	this.progress = progress;
	if (this.parent) {
		this.parent.setProgress(((this.parentEnd - this.parentStart) * this.progress) + this.parentStart);
	}
};

if (typeof exports === 'object' && typeof module === 'object') {
	module.exports = FakeProgress;
}
