import angular from 'angular';
import { Injectable } from './injectable';
import { Options } from './options';

/**
 * Wraps the Angular module and provides utility decorator functions
 */
export class Module {

  /**
   * The original Angular module
   */
  module: ng.IModule;

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
  }

  /**
   * Registers a class as an Angular service.
   * Note: call inject() first to inject dependencies.
   */
  service = (target: Function) => {
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
  controller = (target: Function) => {
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
  directive(fn: ng.IDirectiveFactory, name?: string) {
    this.injectable().directive(fn, name);
  }

  /**
   * Declares an Angular configuration block with no dependency injection.
   * Note: call inject() first to inject dependencies.
   */
  config(configFn: Function) {
    this.module.config(configFn);
  }

  /**
   * Declares an Angular run block with no dependency injection.
   * Note: call inject() first to inject dependencies.
   */
  run(runFn: Function) {
    this.module.run(runFn);
  }

  /**
   * Declares an Angular filter with no dependency injection
   * Note: call inject() first to inject dependencies.
   */
  filter(fn: Function, name?: string) {
    this.injectable().filter(fn, name);
  }

  /**
   * Tells Angular what services should be injected.
   * The array can contain both strings and classes as long as the classes have been registered
   * as service using either the service or the provider decorator.
   */
  inject(...services: any[]) {
    return new Injectable(this.module, services, this.options);
  }

  /**
   * helper to instantiate a new Injectable
   */
  private injectable() {
    return new Injectable(this.module, null, this.options);
  }
}
