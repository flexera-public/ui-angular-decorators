import { app } from './module';
import * as Services from './service';

// Declares a simple filter from its function name
app.filter(function filterWithFunctionName() {
  return () => 'foo';
});

// Declares a simple filter with a custom name
app.filter(function filterWithCustomName() {
  return () => 'foo';
}, 'customFilterName');

// Declares a filter with a dependency
app.inject(Services.ServiceWithNoDependency).filter(function filterWithDependency(
  s: Services.ServiceWithNoDependency
) {
  return function (input: string) {
    return input + s.value;
  };
});
