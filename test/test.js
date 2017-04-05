const FakeProgress = require('..');
const vows = require('vows');


vows.describe('fake-progress').addBatch({
	'fakeProgress default instance' : {
		topic : function(){
			return new FakeProgress();
		},
		'can be started' : function(fakeProgress){
			assert.equal(typeof(fakeProgress.start), "function");
		},
		'can be ended' : function(fakeProgress){
			assert.equal(typeof(fakeProgress.end), "function");
		},
		'has a progress over time' : function(fakeProgress){
			assert.equal(typeof(fakeProgress.progress), "progress");
		},
		'start' : {
			'topic' : function(fakeProgress){
				return fakeProgress.start();
			}
		}
	},
	'fakeProgress  instance' : {
		topic : function(){
			return new FakeProgress({
				timeConstant : 10000
			});
		},
		'start and wait timeConstant' : {
			'topic' : function(fakeProgress){
				setTimeout(function(){
					this.callback(null, fakeProgress)
				},10000)
				fakeProgress.start();
			},
			'value is around 0.63' : {
				var expected = 1 - Math.exp(-1);

				assert(fakeProgress.progress > expected-0.2, "fakeProgress.progress must be > "+(expected-0.2)+" and is "+fakeProgress.progress);
				assert(fakeProgress.progress < expected+0.2, "fakeProgress.progress must be < "+(expected+0.2)+" and is "+fakeProgress.progress);
			}
			'and wait timeConstant again' : {
					setTimeout(function(){
						this.callback(null, fakeProgress)
					},20000)
				},
				'value is around 0.37' : {
					var expected = 1 - Math.exp(-3);

					assert(fakeProgress.progress > expected-0.2, "fakeProgress.progress must be > "+(expected-0.2)+" and is "+fakeProgress.progress);
					assert(fakeProgress.progress < expected+0.2, "fakeProgress.progress must be < "+(expected+0.2)+" and is "+fakeProgress.progress);
				}
			}
		}
	}
}).run({reporter: 'spec'}, res => {
	if (res.honored !== res.total) {
		process.exit(1); // eslint-disable-line unicorn/no-process-exit
	}
});
