'use strict';

var events = require('../index.js');
var should = require('should');
var redis = require('redis');

describe('Event emitter tests', function(){
	before(function(){
		this.emitter = new events.EventEmitter({
			pub : redis.createClient(),
			sub : redis.createClient(),
			prefix : 'prefix:'
		});
	});

	it('fire/receive event', function(done){
		var arg1 = 'arg1', arg2 = 'arg2';

		var self = this, called = false;
		this.emitter.on('event', function(msg1, msg2){
			if(called){
				throw new Error('Should not get called after removeListener');
			}
			called = true;

			arg1.should.equal(msg1);
			arg2.should.equal(msg2);

			self.emitter.removeAllListeners('event');
			setTimeout(function(){
				self.emitter.emit('event');
				//Second event should not be received, wait some time to finish
				setTimeout(done, 10);
			}, 10);
		});

		setTimeout(function(){
			self.emitter.emit('event', arg1, arg2);
		}, 10);
	});

	after(function(){
		this.emitter.end();
		this.emitter.quit();
	});
});
