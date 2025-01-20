import { activeEffect, trackEffect } from "./effect";
export const ReactiveMap = new WeakMap();

export function createDep(key: any, clearUp: () => any) {
    const dep = new Map() as any;
    dep.clearUp = clearUp;
    dep.name = key;
    return dep;
}

export function track(target: any, key: string | symbol) {
    if (activeEffect) {
        let depsMap = ReactiveMap.get(target);
        if (!depsMap) {
            ReactiveMap.set(target, depsMap = new Map());
        }
        let dep = depsMap.get(key);
        if (!dep) {
            depsMap.set(key, dep = createDep(key, () => depsMap.delete(key)));
        }
        trackEffect(activeEffect, dep)
        console.log(ReactiveMap, 'ReactiveMap')
    }
}