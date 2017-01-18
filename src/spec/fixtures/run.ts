import { app } from './module';
import * as Services from './service';

// Declares a run block with no dependencies
export let runBlockRan = false;
app.run(() => {
  runBlockRan = true;
});

// Declares a run block with a dependency
export let initalizedByRun = '';
app.inject(Services.ServiceWithNoDependency).run((s: Services.ServiceWithNoDependency) => {
  initalizedByRun = s.value;
});
