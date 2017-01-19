/* tslint:disable:max-classes-per-file */
import { app, appPrefix } from './module';
import * as Services from './service';

// Declare a component that will use the default prefix
@app.component({
  template: '<div>{{ $ctrl.message }}</div>'
})
export class ComponentWithDefaultPrefix {
  message = 'hello';
}

// Declare a component with a custom name override
@app.component({
  template: '<div>{{ $ctrl.message }}</div>'
}, 'customName')
export class ComponentWithCustomName {
  message = 'hello';
}

// Declare a component with a dependency injected in its constructor
@app.inject(Services.ServiceWithNoDependency).component({
  template: '<div>{{ $ctrl.message }}</div>'
})
export class ComponentWithDependency {
  message: string;

  constructor(s: Services.ServiceWithNoDependency) {
    this.message = s.value;
  }
}

// Declare a component that will use a custom prefix
@appPrefix.component({
  template: '<div>{{ $ctrl.message }}</div>'
})
export class ComponentWithCustomPrefix {
  message = 'hello';
}

// Declare a component with a custom name on a module with a custom prefix
@appPrefix.component({
  template: '<div>{{ $ctrl.message }}</div>'
}, 'otherCustomName')
export class ComponentWithCustomPrefixAndName {
  message = 'hello';
}
