import { app } from './module';
import * as Services from './service';

// Declare a directive with a dependency
@app.directive()
export class DirectiveTestingFunction {
  definition(): ng.IDirective {
    return {
      template: '<div>{{ $ctrl.message }}</div>',
      controller: app
        .inject(Services.ServiceWithNoDependency)
        .function(function (
          s: Services.ServiceWithNoDependency
        ) {
          this.message = s.value;
        }),
      controllerAs: '$ctrl'
    };
  }
}
