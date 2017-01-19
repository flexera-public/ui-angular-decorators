import { ServiceWithNoDependency } from './';
import { app } from './module';

// A simple class with properties that will be injected
export class InjectableProperties {
  @app.inject(ServiceWithNoDependency).property
  readonly foo: ServiceWithNoDependency;

  @app.inject('ServiceWithNoDependency').property
  readonly bar: ServiceWithNoDependency;
};
