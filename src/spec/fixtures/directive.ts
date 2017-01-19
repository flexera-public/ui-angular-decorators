/* tslint:disable:max-classes-per-file */

import { app, appPrefix } from './module';
import * as Services from './service';

@app.controller
export class DirectiveController {
  message = 'hello';
}

@app.directive() // Declare a directive with a named function
@appPrefix.directive() // Declare a directive with a named function and a custom prefix
export class Directive implements ng.IDirective {
  definition(): ng.IDirective {
    return {
      template: '<div>{{ $ctrl.message }}</div>',
      controller: DirectiveController,
      controllerAs: '$ctrl'
    };
  }
}

// Declare a directive with a dependency
@app.inject(Services.ServiceWithNoDependency).directive()
export class DirectiveWithDependency {
  definition(s: Services.ServiceWithNoDependency): ng.IDirective {
    return {
      template: '<div>{{ $ctrl.message }}</div>',
      controller: function () {
        this.message = s.value;
      },
      controllerAs: '$ctrl'
    };
  }
}

@app.directive('customDirectiveName') // Declare a directive with an explicit name
@appPrefix.directive('otherCustomDirectiveName') // Declare a directive with a custom name and a custom prefix
export class DirectiveWithName {
  definition(): ng.IDirective {
    return {
      template: '<div>{{ $ctrl.message }}</div>',
      controller: DirectiveController,
      controllerAs: '$ctrl'
    };
  }
}
