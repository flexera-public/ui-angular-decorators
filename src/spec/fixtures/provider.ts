/* tslint:disable:max-classes-per-file */
import { app } from './module';

// Define the service offered by the provider
export interface ProvidedService {
  foo: string;
}

// Declare a provider
@app.provider<ProvidedService>()
export class ProviderWithNoDependency {

  value = 'initialized';

  $get() { return { foo: 'bar' }; }
}

// Declare a provider with a dependency on another provider using its class
@app.inject(ProviderWithNoDependency).provider<ProvidedService>()
export class ProviderWithClassDependency {

  value: string;

  constructor(s: ProviderWithNoDependency) {
    this.value = s.value;
  }

  $get() { return { foo: 'bar' }; }
}

// Declare a provider with a dependency on another provider using its name
@app.inject('ProviderWithNoDependencyProvider').provider<ProvidedService>()
export class ProviderWithStringDependency {
  value: string;
  constructor(s: ProviderWithNoDependency) {
    this.value = s.value;
  }

  $get() { return { foo: 'bar' }; }
}

// Declare a provider with multiple dependencies mixing both class and name
@app.inject('ProviderWithNoDependencyProvider', ProviderWithClassDependency).provider<ProvidedService>()
export class ProviderWithTwoDependencies {
  v1: string;
  v2: string;

  constructor(s1: ProviderWithNoDependency, s2: ProviderWithClassDependency) {
    this.v1 = s1.value;
    this.v2 = s2.value;
  }

  $get() { return { foo: 'bar' }; }
}
