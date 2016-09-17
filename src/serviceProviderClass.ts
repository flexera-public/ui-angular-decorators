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

export default ServiceProviderClass;
