import { activeEffect, effect } from "./effect";
import { ReactiveMap } from "./track";

export function notify(target, key, value, oldValue) {
    // console.log('触发依赖更新', ReactiveMap)
    const notifyMap = ReactiveMap.get(target)
    if (notifyMap) {
        const dep = notifyMap.get(key)
        if (dep) {
            triggerEffects(dep);
        } else {
            console.log('没有该依赖', key)
        }
    }
    console.log(ReactiveMap, 'ReactiveMap')
}

export function triggerEffects(dep: any) {
    console.log(dep, 'triggerEffect')
    const keys = [...dep.keys()];
    keys.forEach(effect => {
        effect.scheduler();
    });
}