import Module from '../../../index';

export var appPrefix = new Module('testAppWithPrefix', [], { prefix: 'foo' });
export var app = new Module('testApp', ['testAppWithPrefix']);
