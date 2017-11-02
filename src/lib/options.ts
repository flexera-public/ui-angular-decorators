import angular from 'angular';

/**
 * Additional options used to configure the Angular module
 */
export interface Options {
  /**
   * Define what to prefix components and directives names with
   */
  prefix?: string;

  /**
   * Allow explicit angular reference, for cases where angular is an external dependency
   */
  angular?: angular.IAngularStatic;
}
