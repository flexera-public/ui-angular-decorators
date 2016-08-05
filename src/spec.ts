import 'angular'
import 'angular-mocks/angular-mocks'
import ngModule from './index'
import * as Fixtures from './fixtures'

describe(ngModule.name, () => {

  var $controller: ng.IControllerService

  beforeEach(angular.mock.module('testApp'))

  beforeEach(inject((_$controller_: ng.IControllerService) => {
    $controller = _$controller_
  }))

  describe('Decorators', () => {
    it('should register a service with Angular', inject([Fixtures.TestService.name, (s: Fixtures.TestService) => {
      expect(s.value).toBe('test service')
    }]))

    it('should register a controller with Angular', () => {
      var controller = <Fixtures.TestController>$controller(Fixtures.TestController.name)
      expect(controller.value).toBe('test controller')
    })

    it('should register a provider with Angular', inject([Fixtures.MyProvider.name, (service: any) => {
      expect(service.foo).toBe('bar')
    }]))

    describe('inject', () => {
      it('should inject a service referenced by its class', () => {
        var controller = <Fixtures.ControllerWithClassInject>$controller(Fixtures.ControllerWithClassInject.name)
        expect(controller.value).toBe('test service')
      })

      it('should inject a service referenced by its name', () => {
        var controller = <Fixtures.ControllerWithNameInject>$controller(Fixtures.ControllerWithClassInject.name)
        expect(controller.value).toBe('test service')
      })
    })

    describe('component', () => {
      it('should register a component with Angular', inject((
        $compile: ng.ICompileService,
        $rootScope: ng.IRootScopeService
      ) => {
        var scope = $rootScope.$new()
        var element = <any>$compile('<test-component></test-component>')(scope)
        scope.$digest()
        expect(element.find('div').text()).toContain('hello')
      }))

      it('should register the component\'s controller with Angular', () => {
        var controller = $controller(Fixtures.TestController.name)
        expect(controller).not.toBeNull()
      })
    })
  })

  describe('Helpers', () => {
    it('should run a config block with an injected class', () => {
      expect(Fixtures.initializedByProvider).toBe('initialized')
    })

    it('should run a run block with an injected class', () => {
      expect(Fixtures.initalizedByRun).toBe('bar')
    })

    it('should register a filter with an injected class', inject(($filter: ng.IFilterService) => {
      var filter = $filter<(input:string)=>string>('testFilter')
      expect(filter('filter injected ')).toBe('filter injected test service')
    }))
  })
})
