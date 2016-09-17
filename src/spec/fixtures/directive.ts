import { app, appPrefix } from './module';
import * as Services from './service';

@app.controller
export class DirectiveController {
  message = 'hello';
}

// Declare a directive with a named function
app.directive(function Directive() {
  return {
    template: '<div>{{ $ctrl.message }}</div>',
    controller: DirectiveController,
    controllerAs: '$ctrl'
  };
});

// Declare a directive with a dependency
app
  .inject(Services.ServiceWithNoDependency)
  .directive(function DirectiveWithDependency(s: Services.ServiceWithNoDependency): ng.IDirective {
  return {
    template: '<div>{{ $ctrl.message }}</div>',
    controller: function() {
      this.message = s.value;
    },
    controllerAs: '$ctrl'
  };
});

// Declare a directive with an explicit name
app.directive(() => {
  return {
    template: '<div>{{ $ctrl.message }}</div>',
    controller: DirectiveController,
    controllerAs: '$ctrl'
  };
}, 'customDirectiveName');

// Declare a directive with a named function and a custom prefix
appPrefix.directive(function Directive() {
  return {
    template: '<div>{{ $ctrl.message }}</div>',
    controller: DirectiveController,
    controllerAs: '$ctrl'
  };
});

// Declare a directive with a custom name and a custom prefix
appPrefix.directive(() => {
  return {
    template: '<div>{{ $ctrl.message }}</div>',
    controller: DirectiveController,
    controllerAs: '$ctrl'
  };
}, 'otherCustomDirectiveName');
