import { app } from './module';
import * as Providers from './provider';

// A simple config block
export let configRan = false;
app.config(() => { configRan = true; });

// A config block with a dependency
export let configWithDepenedencyRan = '';
app.inject(Providers.ProviderWithNoDependency)
  .config((p: Providers.ProviderWithNoDependency) => {
    configWithDepenedencyRan = p.value;
  });
