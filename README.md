# global-events

Global node's events library in distributed system via redis pub/sub mechanism

[![Build Status](https://travis-ci.org/rain1017/global-events.svg?branch=master)](https://travis-ci.org/rain1017/global-events)
[![Dependencies Status](https://david-dm.org/rain1017/global-events.svg)](https://david-dm.org/rain1017/global-events)

API is compatible with Node's builtin [events library](http://nodejs.org/api/events.html) except the following exception:

All listener operations are local (In fact you are calling built-in events library), so you can't remove a remote listener, or get global listener counts. 

Do not make any assumption on api order in a distributed system (We can't guarantee a listener can get called right after addListener)

## Quick Start

```
var redis = require('redis');
var publishClient = redis.createClient();
var subscribeClient = redis.createClient();
var events = require('global-events');

// pub: redis client for publish events
// sub: redis client for subscribe events (should use the same db as pub)
// You can left pub/sub to null as long as you don't fire event or add listeners
//
// prefix(Optional): redis pub/sub channel prefix
var emitter = new events.EventEmitter({
									pub: publishClient, 
									sub: subscribeClient, 
									prefix: 'prefix'
									});

emitter.on('event', function(arg1, arg2 ...){});

// WARN: In fact the event subscription can't take effect immediately
//       delay some time before emit if you wish to see listener really get called
emitter.emit('event', arg1, arg2 ...); //args should be JSON serializeble

// close redis connection (optional)
emitter.end();

```

## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
