import { activeEffect } from "./effect";
import { notify } from "./notify";
import { track } from "./track";

export enum ReactiveFlags {
    IS_REACTIVE = '__v_isReactive',
}
export const mutableHandlers: ProxyHandler<any> = {
    get(target, key, receiver) {
        if (key === ReactiveFlags.IS_REACTIVE) return true
        if (activeEffect) {
            track(target, key);
        }
        return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
        const oldValue = target[key];
        let result = Reflect.set(target, key, value, receiver);
        if (oldValue !== value) {
            notify(target, key, value, oldValue);
        }
        return result
    }
} 