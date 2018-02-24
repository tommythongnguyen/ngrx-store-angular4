/**
 * Angular Routing Data with NGRX Effects
 *
 * When a route changes and we load a component, 
 * we usually need to resolve some data for the component to load. 
 * Today you might use route resolvers or route guards to fetch the data and load the data.
 * If you are using NGRX and NGRX effects you might typically dispatch a event to load this, 
 * this usually looks like this:
 */

@Injectable()
export class PizzaResolver implements Resolve<void> {
    constructor(private store: Store<App>) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.store.dispatch(new LoadPizza());
    }
}

/**and its bound to our routes like this:*/
export const routes: Routes = [
    {
        path: '',
        component: PizzaComponent,
        resolve: { data: PizzaResolver }
    }
]
/**
 * The more I did this over and over the more it felt oddball in a observable stream world. 
 * What if we listened to route changes in an effect and just triggered events then? 
 * That would feel nice in our stream world!
 * Most of us probably already have some setup for navigating with effects like suggested by NGRX 
 * so why not just listen to router events here and dispatch a event. 
 * Once we dispatch that we can then listen for that action in our effect and do this loading for us!
*/
export class RouterGo implements Action {
    readonly type = '[Router] Go';

    constructor(
        public payload: {
            path: any[];
            queryParams?: object;
            extras?: NavigationExtras;
        }
    ) {}
}

export class RouterBack implements Action {
    readonly type = '[Router] Back';
}

export class RouterForward implements Action {
    readonly type = '[Router] Forward';
}

export class RouteChange implements Action {
    readonly type = '[Router] Route Change';
    constructor(public payload: { params: any, path: string }) {}
}

@Injectable()
export class RouterEffects {
    constructor(
        private actions$: Actions,
        private router: Router,
        private location: Location,
        private store: Store<any>
    ) {
        this.listenToRouter();
    }

    @Effect({ dispatch: false })
    navigate$ = this.actions$.pipe(
        ofType('[Router] Go'),
        map((action: RouterGo) => action.payload),
        tap(({ path, queryParams, extras }) => this.router.navigate(path, { queryParams, ...extras }))
    );

    @Effect({ dispatch: false })
    navigateBack$ = this.actions$.pipe(ofType('[Router] Back'), tap(() => this.location.back()));

    @Effect({ dispatch: false })
    navigateForward$ = this.actions$.pipe(
        ofType('[Router] Forward'),
        tap(() => this.location.forward())
    );

    private listenToRouter() {
        this.router.events.pipe(
            filter(event => event instanceof ActivationEnd)
        ).subscribe((event: ActivationEnd) =>
            this.store.dispatch(new RouteChange({
                params: { ...event.snapshot.params },
                path: event.snapshot.routeConfig.path
            }))
        );
    }
}

/**then in our effect, we just need to listen for the action and dispatch our LoadPizza action.*/
@Injectable()
export class PizzaEffects {

  @Effect()
  pizzaRouted$ = this.actions$.pipe(
    ofType('[Router] Route Change'),
    filter(routeChangeAction => routeChangeAction.payload.path === 'pizza/:id'),
    concatMap(() => new LoadPizza())
  );
}
/**That pretty nice! But wait, we can clean that up a little with a custom RX operator:*/
import { OperatorFunction } from 'rxjs/interfaces';
import { Action } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { RouteChange } from './router.actions';


export function ofRoute(route: string | string[]): OperatorFunction<Action, Action> {
    return filter((action: Action) => {
        const isRouteAction = action.type === '[Router] Route Change';
        if (isRouteAction) {
            const routeAction = action as RouteChange;
            const routePath = routeAction.payload.path;
            if (Array.isArray(route)) {
                return route.includes(routePath);
            } else {
                return routePath === route;
            }
        }
        return isRouteAction;
    });
}
/**Now our code can be as simple as:*/
@Effect() pizzaRouted = this.actions$.pipe(ofRoute('pizza/:id'))

/**One caveat to this is we can’t actually prevent the component from loading before our data is resolved. 
 * My answer to that is you shouldn’t be doing that! 
 * We want to give the user instant satisfaction so going ahead and loading the page and throwing up a spinner 
 * or something while you wait is the ideal solution. 
 * In a observable world, when the data is resolve it will already be a stream and just pick up the new changes.
This feels really nice to me and fits the observable stream model we have going on with NGRX.
*/