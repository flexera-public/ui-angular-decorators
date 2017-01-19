export type InjectableClassWithParams<T> = new (...args: any[]) => T;
export type InjectableClassWithoutParams<T> = new () => T;

export type InjectableReferences = Array<string | InjectableClassWithParams<any>>;

export type DirectiveClass = new () => {
  definition(...args: any[]): ng.IDirective;
};
