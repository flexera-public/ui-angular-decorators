/**
 * Wraps the Angular module and provides utility decorator functions
 */
export default class ngModule {

  /**
   * The original Angular module
   */
  module: ng.IModule

  constructor(name: string, dependencies: string[]) {
    this.module = angular.module(name, dependencies)
  }

  /**
   * Registers a class as an Angular service
   */
  service = (target: Function) => {
    this.module.service(target.name, target)
  }

  /**
   * Registers a class as an Angular provider
   */
  provider = (target: ng.IServiceProviderClass) => {
    this.module.provider(target.name, target)
  }

  /**
   * Registers a class as an Angular controller
   */
  controller = (target: Function) => {
    this.module.controller(target.name, target)
  }

  /**
   * Registers a class as an Angular component.
   * Automatically sets the class as the controller.
   */
  component(name: string, options: ng.IComponentOptions) {
    return (target: any) => {
      options.controller = target
      this.module.controller(target.name, target).component(name, options)
    }
  }

  /**
   * Declares an Angular configuration block with dependencies declaration
   * that survive minification and support passing classes in addition to strings
   */
  config(dependencies: any[], configFn: Function) {
    this.module.config(dependencies.map(s => s.name ? s.name + 'Provider' : s).concat(configFn))
    return this;
  }

  /**
   * Declares an Angular run block with dependencies declaration
   * that survive minification and support passing classes in addition to strings
   */
  run(dependencies: any[], runFn: Function) {
    this.module.run(dependencies.map(s => s.name || s).concat(runFn))
    return this;
  }

  /**
   * Declares an Angular filter with dependencies declaration
   * that survive minification and support passing classes in addition to strings
   */
  filter(name: string, dependencies: any[], filterFactory: Function) {
    this.module.filter(name, dependencies.map(s => s.name || s).concat(filterFactory))
    return this;
  }

  /**
   * Tells Angular what services should be injected in the class constructor.
   * The array can contain both classes and strings.
   */
  inject(services: any[]) {
    return function (target: any) {
      if (!services || !services.length) return;
      target.$inject = services.map(s => s.name || s)
    }
  }

}
