import ngModule from '../index'

export var app = new ngModule('testApp', [])

// Controller

@app.controller
export class TestController {
  value = 'test controller'
}

// Service

@app.service
export class TestService {
  value = 'test service'
}

// Provider & config

export var initializedByProvider = ''

@app.provider
export class MyProvider {

  value = 'initialized'

  $get() {
    return {
      foo: 'bar'
    }
  }
}

// config block
app.config([MyProvider], (p: MyProvider) => {
  initializedByProvider = p.value
})

// Inject by class

@app.controller
@app.inject([TestService])
export class ControllerWithClassInject {
  value: string;

  constructor(s: TestService) {
    this.value = s.value
  }
}

// Inject by name

@app.controller
@app.inject(['TestService'])
export class ControllerWithNameInject {
  value: string;

  constructor(s: TestService) {
    this.value = s.value
  }
}

// Component

@app.component('testComponent', {
  template: '<div>{{ $ctrl.message }}</div>'
})
export class TestComponent {
  message = 'hello'
}

// Run block

export var initalizedByRun = ''

app.run([MyProvider], (s: any) => {
  initalizedByRun = s.foo
})

// Filter

app.filter('testFilter',[TestService], (
  s: TestService
) => {
  return function(input: string) {
    return input + s.value
  }
})
