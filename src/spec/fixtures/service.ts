import { app } from './module';

// Declare a service
@app.service
export class ServiceWithNoDependency {
  value = 'test service';
}

// Declare a service with a dependency using its class
@app.inject(ServiceWithNoDependency).service
export class ServiceWithClassDependency {
  value: string;

  constructor(s: ServiceWithNoDependency) {
    this.value = s.value + ' with dependency';
  }
}

// Declare a service with a dependency using its name
@app.inject('ServiceWithNoDependency').service
export class ServiceWithStringDependency {
  value: string;

  constructor(s: ServiceWithNoDependency) {
    this.value = s.value + ' with string dependency';
  }
}

// Declare a service with multiple dependencies mixing both class and name
@app.inject('ServiceWithNoDependency', ServiceWithClassDependency).service
export class ServiceWithTwoDependencies {
  v1: string;
  v2: string;

  constructor(s1: ServiceWithNoDependency, s2: ServiceWithClassDependency) {
    this.v1 = s1.value;
    this.v2 = s2.value;
  }
}
