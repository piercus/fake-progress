const FakeProgress = require('..');
const vows = require('vows');
const assert = require('assert');


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
			'value is around 0.63' : function(fakeProgress){
				var expected = 1 - Math.exp(-1);

				assert(fakeProgress.progress > expected-0.2, "fakeProgress.progress must be > "+(expected-0.2)+" and is "+fakeProgress.progress);
				assert(fakeProgress.progress < expected+0.2, "fakeProgress.progress must be < "+(expected+0.2)+" and is "+fakeProgress.progress);
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
					assert(fakeProgress.progress > expected-0.2, "fakeProgress.progress must be > "+(expected-0.2)+" and is "+fakeProgress.progress);
					assert(fakeProgress.progress < expected+0.2, "fakeProgress.progress must be < "+(expected+0.2)+" and is "+fakeProgress.progress);
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
}).run({reporter: 'spec'}, res => {
	if (res.honored !== res.total) {
		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	}
	process.exit(0)
});
