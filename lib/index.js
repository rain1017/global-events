'use strict';

var util = require('util');
var EventEmitter = require('events').EventEmitter;

var GlobalEventEmitter = function(opts) {
	EventEmitter.call(this, opts);

	opts = opts || {};
	this.pub = opts.pub;
	this.sub = opts.sub;
	this.prefix = opts.prefix || '';
	this.subscribedEvents = {};

	var self = this;
	this.on('newListener', function(event, listener){
		self._checkSubscribe(event);
	});

	this.on('removeListener', function(event, listener){
		process.nextTick(self._checkUnSubscribe.bind(self, event));
	});

	if(this.sub){
		this.sub.on('message', function(channel, msg){
			var event = self.prefix ? channel.slice(self.prefix.length) : channel;
			self.listeners(event).forEach(function(listener){
				listener.apply(null, JSON.parse(msg));
			});
		});
	}
};

util.inherits(GlobalEventEmitter, EventEmitter);

var proto = GlobalEventEmitter.prototype;

proto.emit = function(event){
	if(this._isReservedEvents(event)){
		return GlobalEventEmitter.super_.prototype.emit.apply(this, arguments);
	}
	var channel = this.prefix + arguments[0];
	var args = [].slice.call(arguments, 1);

	this.pub.publish(channel, JSON.stringify(args));
};

proto._checkUnSubscribe = function(event){
	if(this._isReservedEvents(event)){
		return;
	}
	if(this.listeners(event).length === 0){
		if(this.subscribedEvents[event]){
			this.sub.unsubscribe(this.prefix + event);
			delete this.subscribedEvents[event];
		}
	}
};

proto._checkSubscribe = function(event){
	if(this._isReservedEvents(event)){
		return;
	}
	if(!this.subscribedEvents[event]){
		this.sub.subscribe(this.prefix + event);
		this.subscribedEvents[event] = true;
	}
};

proto._isReservedEvents = function(event){
	return event === 'newListener' || event === 'removeListener';
};

proto.end = function(){
	if(!!this.sub){
		this.sub.end();
	}
	if(!!this.pub){
		this.pub.end();
	}
};

proto.quit = function(){
	if(!!this.sub){
		this.sub.quit();
	}
	if(!!this.pub){
		this.pub.quit();
	}
};

module.exports = {
			EventEmitter : GlobalEventEmitter
		};
