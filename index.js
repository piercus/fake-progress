/**
 * Represents a fakeProgress
 * @constructor
 * @param {object} options - options of the contructor
 * @param {object} [options.timeConstant=1000] - the timeConstant in milliseconds (see https://en.wikipedia.org/wiki/Time_constant)
 */

var FakeProgress = function(opts){
  if(!opts){
    opts = {}
  }

  this.timeConstant = opts.timeConstant || 1000;
  this.progress = 0;
  this._running = false;
  this._intervalFrequency = 100;
};

FakeProgress.prototype.start = function(){
  this._running = true;
  this._time = 0;
  this._intervalId = setInterval(this.onInterval.bind(this), this._intervalFrequency);
};

FakeProgress.prototype.onInterval = function(){
  this._time += this._intervalFrequency;
  this.progress = (1 - Math.exp(-1*this._time/this.timeConstant))
};

FakeProgress.prototype.end = function(){
  this._running = false;
  clearInterval(this._intervalId);
  this.progress = 1;
};

module.exports = FakeProgress;
