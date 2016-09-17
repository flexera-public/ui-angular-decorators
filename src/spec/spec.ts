import 'angular';
import 'angular-mocks/angular-mocks';
import Module from '../../index';
import * as Fixtures from './fixtures';

describe(Module.name, () => {

  let $controller: ng.IControllerService;
  let $compile: ng.ICompileService;
  let $rootScope: ng.IRootScopeService;

  beforeEach(angular.mock.module(Fixtures.app.name));

  beforeEach(inject((
    _$controller_: ng.IControllerService,
    _$compile_: ng.ICompileService,
    _$rootScope_: ng.IRootScopeService
  ) => {
    $controller = _$controller_;
    $compile = _$compile_;
    $rootScope=_$rootScope_;
  }));

  it('should work', () => {
    expect(1).toBe(1);
  });

  describe('component', () => {
    function component(name: string) {
      let scope = $rootScope.$new();
      let element = <any>$compile(`<${name}></${name}>`)(scope);
      scope.$digest();
      return element;
    }

    it('should register a component with Angular', () => {
      let element = component('rs-component-with-default-prefix');
      expect(element.find('div').text()).toContain('hello');
    });

    it('should register the component\'s controller with Angular', () => {
      let controller = $controller(Fixtures.ComponentWithDefaultPrefix.name);
      expect(controller).not.toBeNull();
    });

    it('should support a custom name override', () => {
      let element = component('custom-name');
      expect(element.find('div').text()).toContain('hello');
    });

    it('should support dependency injection', () => {
      let element = component('rs-component-with-dependency');
      expect(element.find('div').text()).toContain('test service');
    });

    it('should support a custom prefix on a different module', () => {
      let element = component('foo-component-with-custom-prefix');
      expect(element.find('div').text()).toContain('hello');
    });

    it('should support a custom name override on a module with a custom prefix', () => {
      let element = component('other-custom-name');
      expect(element.find('div').text()).toContain('hello');
    });
  });

  describe('config', () => {
    it('should run a simple config block', () => {
      expect(Fixtures.configRan).toBe(true);
    });

    it('should run a config block with a dependency', () => {
      expect(Fixtures.configWithDepenedencyRan).toBe('initialized');
    });
  });

  describe('controller', () => {
    it('should register a controller using its class name');
    it('should inject a controller dependency using a class');
    it('should inject a controller dependency using a string');
    it('should inject multiple controller dependencies using class and string');
    it('should inject a service created by a provider using its class');
    it('should inject a service created by a provider using its name');
  });

  describe('directive', () => {
    it('should register a directive using a named function');
    it('should register a directive with a dependency');
    it('should register a directive with an explicit name');
    it('should support a custom directive prefix');
    it('should register a directive with an explicit name even if there is a custom prefix')
  });

  describe('filter', () => {
    it('should register a filter using a named function');
    it('should register a filter with an explicit name');
    it('should register a filter with a dependency');
  });

  describe('provider', () => {
    it('should register a provider');
    it('should support injecting a provider by class in a provider');
    it('should support injecting a provider by string in a provider');
    it('should support injecting multiple providers using a mix of class and string');
  });

  describe('run', () => {
    it('should run a simple run block', () => {
      expect(Fixtures.runBlockRan).toBe(true);
    });

    it('should run a run block with a dependency', () => {
      expect(Fixtures.initalizedByRun).toBe('test service');
    });
  });

  describe('service', () => {
    it('should register a service');
    it('should support injecting a service by class in a service');
    it('should support injecting a service by string in a service');
    it('should support injecting multiple services using a mix of class and string');
  });

});
