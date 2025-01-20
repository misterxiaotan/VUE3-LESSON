import { isObject } from "@vue/shared"
import { mutableHandlers, ReactiveFlags } from "./baseHandler";

const reactiveMap = new WeakMap();

export function reactive(target: any) {
    if (!isObject(target)) return;
    if (target[ReactiveFlags.IS_REACTIVE]) return target
    return createReactiveObject(target);

}
function createReactiveObject(target: any) {
    const exitsProxy = reactiveMap.get(target);
    // 缓存
    if (exitsProxy) {
        return exitsProxy;
    } else {
        const proxy = new Proxy(target, mutableHandlers)
        reactiveMap.set(target, proxy);
        return proxy;
    }

}
export function toReactive(value: any) {
    return isObject(value) ? reactive(value) : value;
}