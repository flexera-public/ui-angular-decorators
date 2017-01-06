import { app } from './module';
import * as Providers from './provider';
import * as Services from './service';

// Declare a controller
@app.controller
export class ControllerWithNoDependency {
  value = 'test controller';
}

// Declare a controller with a dependency using its class
@app.inject(Services.ServiceWithNoDependency).controller
export class ControllerWithClassDependency {
  value: string;

  constructor(s: Services.ServiceWithNoDependency) {
    this.value = s.value;
  }
}

// Declare a controller with a dependency using its name
@app.inject('ServiceWithNoDependency').controller
export class ControllerWithNameDependency {
  value: string;

  constructor(s: Services.ServiceWithNoDependency) {
    this.value = s.value;
  }
}

// Declare a controller with multiple dependencies using a mix of class and name
@app.inject('ServiceWithNoDependency', Services.ServiceWithClassDependency).controller
export class ControllerWithTwoDependencies {
  v1: string;
  v2: string;

  constructor(s1: Services.ServiceWithNoDependency, s2: Services.ServiceWithClassDependency) {
    this.v1 = s1.value;
    this.v2 = s2.value;
  }
}

// Declare a controller with a dependency on a provider using its class
@app.inject(Providers.ProviderWithNoDependency).controller
export class ControllerWithProviderClassDependency {
  value: string;

  constructor(s: Providers.ProvidedService) {
    this.value = s.foo;
  }
}

// Declare a controller with a dependency on a provider using its name
@app.inject('ProviderWithNoDependency').controller
export class ControllerWithProviderNameDependency {
  value: string;

  constructor(s: Providers.ProvidedService) {
    this.value = s.foo;
  }
}
