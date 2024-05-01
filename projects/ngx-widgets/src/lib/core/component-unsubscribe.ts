import { isDevMode } from '@angular/core';

import { Observable, Subject, takeUntil } from 'rxjs';
import { SafeSubscriber } from 'rxjs/internal/Subscriber';

/**
 * Automatically unsubscribe from an Observable when the view is destroyed
 * Tested with checking the "complete" event of a subscribe method
 * @description
 * An Annotation that should be used with an Observable typed variable to handle its subscriptions
 * @author gergo.asztalos
 */
export function UnsubscribeOnDestroy<ObservableType>(): PropertyDecorator {
  return function (target: any, propertyKey: string | symbol) {
    const ngOnDestroy = target.ngOnDestroy;

    const secretKey = `_${<string>propertyKey}$`;
    // Probably with function we could use own context
    const destroyKey = (_this: any) =>
      _this.hasOwnProperty('destroy$') ? 'destroy$' : `${_this.constructor.name}_destroy$`;
    Object.defineProperty(target, secretKey, { enumerable: false, writable: true });
    Object.defineProperty(target, propertyKey, {
      configurable: true,
      enumerable: true,
      get: function() {
        return this[secretKey];
      },
      set: function(newValue: Observable<ObservableType> | SafeSubscriber<ObservableType>) {
        if (!this[destroyKey(this)]) {
          this[destroyKey(this)] =  new Subject();
        }
        if (newValue instanceof Observable) {
          this[secretKey] = newValue.pipe(
            takeUntil(this[destroyKey(this)]),
          );
        } else {
          this[secretKey] = newValue;
        }
      },
    });

    target.ngOnDestroy = function () {
      if (this[propertyKey] instanceof SafeSubscriber) {
        this[propertyKey].unsubscribe();
        this[secretKey].unsubscribe();
      } else if (this.hasOwnProperty(destroyKey(this))) {
        this[destroyKey(this)].next();
        this[destroyKey(this)].complete();
      }
      delete this[secretKey];
      if (isDevMode()) {
        // eslint-disable-next-line no-console,max-len
        console.debug(`<UnsubscribeOnDestroy> - Observable/Subscription <${<string>propertyKey}> completed in class: ${this.constructor.name}`);
      }
      ngOnDestroy && ngOnDestroy.call(this);
    };
  };
}
