import angular from 'angular';
import 'angular-mocks/angular-mocks';
import Module from '../../index';
import * as Fixtures from './fixtures';

describe(Module.name, () => {

  let $controller: ng.IControllerService;
  let $compile: ng.ICompileService;
  let $rootScope: ng.IRootScopeService;
  let $filter: ng.IFilterService;

  beforeEach(angular.mock.module(Fixtures.app.name));

  beforeEach(inject((
    _$controller_: ng.IControllerService,
    _$compile_: ng.ICompileService,
    _$rootScope_: ng.IRootScopeService,
    _$filter_: ng.IFilterService
  ) => {
    $controller = _$controller_;
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    $filter = _$filter_;
  }));

  function renderElement(name: string) {
    let scope = $rootScope.$new();
    let element = <any>$compile(`<${name}></${name}>`)(scope);
    scope.$digest();
    return element;
  }

  describe('component', () => {
    it('should register a component with Angular', () => {
      let element = renderElement('rs-component-with-default-prefix');
      expect(element.find('div').text()).toContain('hello');
    });

    it('should register the component\'s controller with Angular', () => {
      let controller = $controller(Fixtures.ComponentWithDefaultPrefix.name);
      expect(controller).not.toBeNull();
    });

    it('should support a custom name override', () => {
      let element = renderElement('custom-name');
      expect(element.find('div').text()).toContain('hello');
    });

    it('should support dependency injection', () => {
      let element = renderElement('rs-component-with-dependency');
      expect(element.find('div').text()).toContain('test service');
    });

    it('should support a custom prefix on a different module', () => {
      let element = renderElement('foo-component-with-custom-prefix');
      expect(element.find('div').text()).toContain('hello');
    });

    it('should support a custom name override on a module with a custom prefix', () => {
      let element = renderElement('other-custom-name');
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
    it('should register a controller using its class name', () => {
      let controller = <Fixtures.ControllerWithNoDependency>$controller(Fixtures.ControllerWithNoDependency.name);
      expect(controller.value).toBe('test controller');
    });

    it('should inject a controller dependency using a class', () => {
      let controller = <Fixtures.ControllerWithClassDependency>$controller(Fixtures.ControllerWithClassDependency.name);
      expect(controller.value).toBe('test service');
    });

    it('should inject a controller dependency using a string', () => {
      let controller = <Fixtures.ControllerWithNameDependency>$controller(Fixtures.ControllerWithNameDependency.name);
      expect(controller.value).toBe('test service');
    });

    it('should inject multiple controller dependencies using class and string', () => {
      let controller = <Fixtures.ControllerWithTwoDependencies>$controller(Fixtures.ControllerWithTwoDependencies.name);
      expect(controller.v1).toBe('test service');
      expect(controller.v2).toBe('test service with dependency');
    });

    it('should inject a service created by a provider using its class', () => {
      let controller = <Fixtures.ControllerWithProviderClassDependency>
        $controller(Fixtures.ControllerWithProviderClassDependency.name);
      expect(controller.value).toBe('bar');
    });

    it('should inject a service created by a provider using its name', () => {
      let controller = <Fixtures.ControllerWithProviderNameDependency>
        $controller(Fixtures.ControllerWithProviderNameDependency.name);
      expect(controller.value).toBe('bar');
    });

  });

  describe('directive', () => {
    it('should register a directive using a named function', () => {
      let element = renderElement('rs-directive');
      expect(element.find('div').text()).toContain('hello');
    });

    it('should register a directive with a dependency', () => {
      let element = renderElement('rs-directive-with-dependency');
      expect(element.find('div').text()).toContain('test service');
    });

    it('should register a directive with an explicit name', () => {
      let element = renderElement('custom-directive-name');
      expect(element.find('div').text()).toContain('hello');
    });

    it('should support a custom directive prefix', () => {
      let element = renderElement('foo-directive');
      expect(element.find('div').text()).toContain('hello');
    });

    it('should register a directive with an explicit name even if there is a custom prefix', () => {
      let element = renderElement('other-custom-directive-name');
      expect(element.find('div').text()).toContain('hello');
    });
  });

  describe('filter', () => {
    it('should register a filter using a named function', () => {
      let filter = $filter<() => string>('filterWithFunctionName');
      expect(filter()).toBe('foo');
    });

    it('should register a filter with an explicit name', () => {
      let filter = $filter<() => string>('customFilterName');
      expect(filter()).toBe('foo');
    });

    it('should register a filter with a dependency', () => {
      let filter = $filter<(input: string) => string>('filterWithDependency');
      expect(filter('filter injected ')).toBe('filter injected test service');
    });
  });

  describe('provider', () => {
    it('should register a provider', inject([Fixtures.ProviderWithNoDependency.name,
    (service: Fixtures.ProvidedService) => {
      expect(service.foo).toBe('bar');
    }
    ]));

    it('should support injecting a provider by class in a provider', inject([Fixtures.ProviderWithClassDependency.name,
    (service: Fixtures.ProvidedService) => {
      expect(service.foo).toBe('bar');
    }
    ]));

    it('should support injecting a provider by string in a provider',
      inject([Fixtures.ProviderWithStringDependency.name,
      (service: Fixtures.ProvidedService) => {
        expect(service.foo).toBe('bar');
      }
      ])
    );

    it('should support injecting multiple providers using a mix of class and string',
      inject([Fixtures.ProviderWithTwoDependencies.name,
      (service: Fixtures.ProvidedService) => {
        expect(service.foo).toBe('bar');
      }
      ])
    );
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
    it('should register a service',
      inject([Fixtures.ServiceWithNoDependency.name, (s: Fixtures.ServiceWithNoDependency) => {
        expect(s.value).toBe('test service');
      }])
    );

    it('should support injecting a service by class in a service',
      inject([Fixtures.ServiceWithClassDependency.name, (s: Fixtures.ServiceWithClassDependency) => {
        expect(s.value).toBe('test service with dependency');
      }])
    );

    it('should support injecting a service by string in a service',
      inject([Fixtures.ServiceWithStringDependency.name, (s: Fixtures.ServiceWithStringDependency) => {
        expect(s.value).toBe('test service with string dependency');
      }])
    );

    it('should support injecting multiple services using a mix of class and string',
      inject([Fixtures.ServiceWithTwoDependencies.name, (s: Fixtures.ServiceWithTwoDependencies) => {
        expect(s.v1).toBe('test service');
        expect(s.v2).toBe('test service with dependency');
      }])
    );

  });

});
