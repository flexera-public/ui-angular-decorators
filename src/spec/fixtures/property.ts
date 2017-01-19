import { ServiceWithNoDependency } from './';
import { app } from './module';

export class InjectableProperties {
  @app.injectProperty(ServiceWithNoDependency)
  readonly foo: ServiceWithNoDependency;

  @app.injectProperty('ServiceWithNoDependency')
  readonly bar: ServiceWithNoDependency;
};
