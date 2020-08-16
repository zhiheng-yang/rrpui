import {RouteReuseStrategy, ActivatedRouteSnapshot, DetachedRouteHandle} from '@angular/router';

export class RouteReuse implements RouteReuseStrategy {

  public static handlers: { [key: string]: DetachedRouteHandle } = {};

  private static waitDelete: string;

  public static deleteRouteSnapshot(url: string): void {
    const path = url.replace(/\//g, '_');
    // console.log(RouteReuse.handlers[path]);
    delete RouteReuse.handlers[path];
    RouteReuse.waitDelete = path;
  }

  public static deleteRouteSnapshotLike(url: string): void {
    const path = url.replace(/\//g, '_');
    // console.log(RouteReuse.handlers[path]);
    Object.keys(RouteReuse.handlers).forEach(h => {
      if (h.includes(path)) {
        delete RouteReuse.handlers[h];
        RouteReuse.waitDelete = h;
      }
    })
  }

  /** 表示对所有路由允许复用 如果你有路由不想利用可以在这加一些业务逻辑判断 */
  public shouldDetach(route: ActivatedRouteSnapshot): boolean {
    // console.log('===shouldDetach-route', route);
    try{
      if (route.data.hasOwnProperty('reuse')) {
        return route.data.reuse;
      }
      return !(!route.routeConfig || route.routeConfig.loadChildren); } catch (e) {
      return false;
    }
  }

  /** 当路由离开时会触发。按path作为key存储路由快照&组件当前实例对象 */
  public store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    // console.log('===store-route', route, 'store-handle', handle);
    const url = RouteReuse.getRouteUrl(route);
    RouteReuse.handlers[url] = handle;
  }

  /** 若 path 在缓存中有的都认为允许还原路由 */
  public shouldAttach(route: ActivatedRouteSnapshot): boolean {
    // // console.log('===shouldAttach-route', route);
    return !!RouteReuse.handlers[RouteReuse.getRouteUrl(route)]
  }

  /** 从缓存中获取快照，若无则返回null */
  public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    // // console.log('===retrieve-route', route);
    if (!route.routeConfig) {
      return null;
    }
    if (route.routeConfig.loadChildren) {
      return null;
    }
    return RouteReuse.handlers[RouteReuse.getRouteUrl(route)]
  }

  /** 进入路由触发，判断是否同一路由 */
  public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    // // console.log('===shouldReuseRoute-future', future, 'shouldReuseRoute-cur', curr);
    return future.routeConfig === curr.routeConfig &&
      JSON.stringify(future.params) === JSON.stringify(curr.params);
  }

  static getRouteUrl(route: ActivatedRouteSnapshot) {
    // let path = route['_routerState'].url;
    const path = route['_routerState'].url.replace(/\//g, '_');
    // // console.log('---getRouteUrl-path', path);
    return path;
  }

  public static deleteAll() {
    RouteReuse.handlers = {};
    // // console.log('delete all reuse')
    // // console.log(RouteReuse.handlers)
  }

}
