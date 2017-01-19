import angular from 'angular';
import 'function.name-polyfill';
import { Injectable } from './injectable';
import { Options } from './options';
import * as Types from './types';

/**
 * Wraps the Angular module and provides utility decorator functions
 */
export class Module {

  /**
   * The original Angular module
   */
  module: ng.IModule;

  private injector: ng.auto.IInjectorService;

  constructor(
    public name: string,
    dependencies?: string[],
    private options?: Options
  ) {
    // Ensure the default options are present
    this.options = options || {};
    if (!this.options.prefix) {
      this.options.prefix = 'rs';
    }

    // Create the angular module and keep a reference to it
    this.module = angular.module(name, dependencies || []);

    this.module.run(['$injector', (injector: ng.auto.IInjectorService) => {
      // tslint:disable-next-line:no-console
      console.log('==> getting the injector!');
      this.injector = injector;
    }]);
  }

  /**
   * Registers a class as an Angular service.
   * Note: call inject() first to inject dependencies.
   */
  service = (target: Types.InjectableClassWithoutParams<Object>) => {
    this.injectable().service(target);
  }

  /**
   * Registers a class as an Angular provider
   * Note: call inject() first to inject dependencies.
   */
  provider<T>() {
    return this.injectable().provider<T>();
  }

  /**
   * Registers a class as an Angular controller
   * Note: call inject() first to inject dependencies.
   */
  controller = (target: Types.InjectableClassWithoutParams<ng.IController>) => {
    this.injectable().controller(target);
  }

  /**
   * Registers a class as an Angular component.
   * Automatically sets the class as the controller.
   * Note: call inject() first to inject dependencies.
   */
  component(options: ng.IComponentOptions, name?: string) {
    return this.injectable().component(options, name);
  }

  /**
   * Declares an Angular directive.
   * Note: call inject() first to inject dependencies.
   */
  directive(name?: string) {
    return this.injectable().directive(name);
  }

  /**
   * Declares an Angular configuration block with no dependency injection.
   * Note: call inject() first to inject dependencies.
   */
  config(configFn: () => void) {
    this.module.config(configFn);
  }

  /**
   * Declares an Angular run block with no dependency injection.
   * Note: call inject() first to inject dependencies.
   */
  run(runFn: () => void) {
    this.module.run(runFn);
  }

  /**
   * Declares an Angular filter with no dependency injection
   * Note: call inject() first to inject dependencies.
   */
  filter(fn: () => void, name?: string) {
    this.injectable().filter(fn, name);
  }

  /**
   * Tells Angular what services should be injected.
   * The array can contain both strings and classes as long as the classes have been registered
   * as service using either the service or the provider decorator.
   */
  inject(...services: Types.InjectableReferences) {
    return new Injectable(this.module, services, this.options);
  }

  injectProperty(reference: string | Function) {
    return (target: any, key: string) => {

      let val: any;

      Object.defineProperty(target, key, {
        enumerable: true,
        get: () => {
          if (!val) {
            let refName: string = (<Function>reference).name || <string>reference;
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

    };
  }

  /**
   * helper to instantiate a new Injectable
   */
  private injectable() {
    return new Injectable(this.module, null, this.options);
  }
}
