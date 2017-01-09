import Module from '../../../';

export let appPrefix = new Module('testAppWithPrefix', [], { prefix: 'foo' });
export let app = new Module('testApp', ['testAppWithPrefix']);
