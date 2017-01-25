// tslint:disable-next-line:no-reference
/// <reference path="../extensions.d.ts" />

import { Options } from './options';
import * as Types from './types';

/**
 * A stricter form of the service provider class as defined in the Angular typings
 * This one requires an interface to be declared for the provided service in order
 * to enforce type information all the way through.
 */
interface ServiceProvider<T> extends ng.IServiceProvider {
  $get: () => T;
}

interface ServiceProviderClass<T> extends ng.IServiceProviderClass {
  new (...args: any[]): ServiceProvider<T>;
}

/**
 * Used internally to allow the optional inject syntax
 */
export class Injectable {

  private injector: ng.auto.IInjectorService;

  constructor(
    private module: ng.IModule,
    private dependencies?: any[],
    private options?: Options
  ) {
    module.run(['$injector', (injector: ng.auto.IInjectorService) => {
      this.injector = injector;
    }]);
  }

  /**
   * Registers a class as an Angular service
   */
  service = (target: Types.InjectableClassWithParams<Object>) => {
    this.classInject(target);
    this.module.service(target.name, target);
  }

  /**
   * Registers a class as an Angular provider
   */
  provider<T>() {
    return (target: ServiceProviderClass<T>) => {
      this.classInject(target, 'Provider');
      this.module.provider(target.name, target);
    };
  }

  /**
   * Registers a class as an Angular controller
   */
  controller = (target: Types.InjectableClassWithParams<ng.IController>) => {
    this.classInject(target);
    this.module.controller(target.name, <any>target); // TODO: better solution for the any stuff
  }

  /**
   * Registers a class as an Angular component.
   * Automatically sets the class as the controller.
   */
  component(options?: ng.IComponentOptions, name?: string) {
    return (target: Types.InjectableClassWithParams<ng.IController>) => {
      this.classInject(target);
      options = options || {};
      options.controller = target;
      this.module
        .controller(target.name, target)
        .component(name || this.options.prefix + target.name, options);
    };
  }

  /**
   * Declares a directive using the provided dependencies
   */
  directive(name?: string) {
    return (target: Types.DirectiveClass) => {
      let instance = new target();
      this.module.directive(name || this.options.prefix + target.name, this.functionInject(instance.definition));
    };
  }

  /**
   * Declares a configuration block using the provided dependencies.
   * If classes are passed as dependency, they need to have been declared as providers.
   */
  config(fn: Function) {
    this.module.config(this.functionInject(fn, 'Provider'));
  }

  /**
   * Declares a run block using the provided dependencies.
   */
  run(fn: Function) {
    this.module.run(this.functionInject(fn));
  }

  /**
   * Declares an Angular filter using the provided dependencies.
   */
  filter(fn: Function, name?: string) {
    name = name || fn.name;
    if (!name) {
      throw 'Filters should be declared with a named function or you should explicitly provide a name.';
    }
    this.module.filter(name, this.functionInject(fn));
  }

  /**
   * Returns a minification friendly injectable function declaration
   */
  function(fn: Function) {
    return this.functionInject(fn);
  }

  /**
   * Inject a dependency in a class property upon first use
   */
  property = (target: any, key: string) => {
    if (!this.dependencies) {
      throw `Property injection requires 1 dependency. No dependency is being injected into [${key}]`;
    }
    if (this.dependencies.length !== 1) {
      // tslint:disable-next-line:max-line-length
      throw `Property injection only works with 1 dependency. ${this.dependencies.length} dependencies were being injected into [${key}]`;
    }

    let val: any;
    let refName = this.injectables()[0];

    Object.defineProperty(target, key, {
      enumerable: true,
      get: () => {
        if (!val) {
          if (!this.injector) {
            throw `Attempting to inject [${refName}] into [${key}] before the Angular injector is available`;
          }
          val = this.injector.get(refName);
        }

        return val;
      },
      set: () => {
        throw `The property [${key}] is read-only`;
      }
    });
  }

  private functionInject(target: Function, suffix?: string) {
    if (this.dependencies && this.dependencies.length) {
      return this.injectables(suffix).concat(target);
    }
    return [target];
  }

  private classInject(target: Function, suffix?: string) {
    if (this.dependencies && this.dependencies.length) {
      target.$inject = this.injectables(suffix);
    }
  }

  private injectables(suffix = '') {
    return this.dependencies.map(s => s.name ? s.name + suffix : s);
  }
}
