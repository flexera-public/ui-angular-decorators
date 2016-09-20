import { app } from './module';
import * as Providers from './provider';

// A simple config block
export var configRan = false;
app.config(() => { configRan = true; });

// A config block with a dependency
export var configWithDepenedencyRan = '';
app.inject(Providers.ProviderWithNoDependency)
  .config((p: Providers.ProviderWithNoDependency) => {
    configWithDepenedencyRan = p.value;
  });
