const FakeProgress = require('..');
const vows = require('vows');
const assert = require('assert');
const util = require('util');
const EventEmitter = require('events');

var tolerance = 0.03;// 3%


vows.describe('fake-progress').addBatch({
	'fakeProgress default instance' : {
		topic : function(){
			return new FakeProgress();
		},
		'can be started' : function(fakeProgress){
			assert.equal(typeof(fakeProgress.start), "function");
		},
		'has a progress over time' : function(fakeProgress){
			assert.equal(typeof(fakeProgress.progress), "number");
		},
		'can be ended' : function(fakeProgress){
			assert.equal(typeof(fakeProgress.end), "function");
			fakeProgress.end();
		}
	},
	'fakeProgress instance with autoStart' : {
		topic : function(){
			var self = this;
			var fakeProgress = new FakeProgress({
				timeConstant : 10000,
				autoStart : true
			});
			setTimeout(function(){
				self.callback(null, fakeProgress);
			},10000)
		},
		'value is around 1 - Math.exp(-1)' : function(fakeProgress){
			var expected = 1 - Math.exp(-1);

			assert(fakeProgress.progress > expected-tolerance, "fakeProgress.progress must be > "+(expected-tolerance)+" and is "+fakeProgress.progress);
			assert(fakeProgress.progress < expected+tolerance, "fakeProgress.progress must be < "+(expected+tolerance)+" and is "+fakeProgress.progress);
			fakeProgress.stop();
		}
	},
	'fakeProgress instance without autoStart' : {
		topic : function(){
			var self = this;
			var fakeProgress = new FakeProgress({
				timeConstant : 500
			});
			setTimeout(function(){
				self.callback(null, fakeProgress);
			},500)
		},
		'value is 0' : function(fakeProgress){
			assert.equal(fakeProgress.progress, 0);
			fakeProgress.stop();
		}
	},
	'fakeProgress instance' : {
		topic : function(){
			return new FakeProgress({
				timeConstant : 500
			});
		},
		'start and wait timeConstant' : {
			'topic' : function(fakeProgress){
				var self = this;
				setTimeout(function(){
					self.callback(null, fakeProgress);
				},500)
				fakeProgress.start();
			},
			'value is around 1 - Math.exp(-1)' : function(fakeProgress){
				var expected = 1 - Math.exp(-1);

				assert(fakeProgress.progress > expected-tolerance, "fakeProgress.progress must be > "+(expected-tolerance)+" and is "+fakeProgress.progress);
				assert(fakeProgress.progress < expected+tolerance, "fakeProgress.progress must be < "+(expected+tolerance)+" and is "+fakeProgress.progress);
			},
			'and wait timeConstant again' : {
				topic : function(fakeProgress){
					var self = this;
					setTimeout(function(){
						self.callback(null, fakeProgress)
					},1000)
				},
				'value is around Math.exp(-3)' : function(fakeProgress){
					var expected = 1 - Math.exp(-3);
					assert(fakeProgress.progress > expected-tolerance, "fakeProgress.progress must be > "+(expected-tolerance)+" and is "+fakeProgress.progress);
					assert(fakeProgress.progress < expected+tolerance, "fakeProgress.progress must be < "+(expected+tolerance)+" and is "+fakeProgress.progress);
				},
				'then end' : {
					topic : function(fakeProgress){
						fakeProgress.end()
						return fakeProgress
					},
					'value is 1' : function(fakeProgress){
						assert.equal(fakeProgress.progress,1);
					}
				}
			}
		}
	}
}).addBatch({
	'sub Tasks example' : {
		topic : function(){
			var callback = this.callback;

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
					})
				});
			});

			callback(null, p)
		},
		'can be started' : function(fakeProgress){
			assert.equal(typeof(fakeProgress.start), "function");
		},
		'has a progress over time' : function(fakeProgress){
			assert.equal(typeof(fakeProgress.progress), "number");
		},
		'can be ended' : function(fakeProgress){
			assert.equal(typeof(fakeProgress.end), "function");
		},
		'progress is smooth' : {
			topic : function(fakeProgress){
				setTimeout(this.callback.bind(this, null, fakeProgress), 3000)
			},
			'progress is smooth' : function(fakeProgress){
				var expected1 = (1 - Math.exp(-1000/500))*0.3;
				var expected = (0.8-expected1)*2/3+expected1

				assert(fakeProgress.progress > expected-tolerance, "fakeProgress.progress must be > "+(expected-tolerance)+" and is "+fakeProgress.progress);
				assert(fakeProgress.progress < expected+tolerance, "fakeProgress.progress must be < "+(expected+tolerance)+" and is "+fakeProgress.progress);
			}
		}
	}
}).run({reporter: 'spec'}, res => {
	if (res.honored !== res.total) {
		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	}
	process.exit(0)
});
