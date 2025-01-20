import { activeEffect, trackEffect } from "./effect";
import { triggerEffects } from "./notify";
import { toReactive } from "./reactive";
import { createDep } from "./track";

export function ref(value: any) {
    return createRef(value);
}

function createRef(value: any) {
    return new RefImpl(value);
}

class RefImpl {
    private __v_isRef = true;
    public _value: any;
    public dep: any;
    constructor(public _rawValue: any) {
        this._value = toReactive(_rawValue);
    }
    get value() {
        // track
        trackRefValue(this);
        return this._value;
    }
    set value(newVal) {
        if (newVal !== this._value) {
            this._rawValue = newVal;
            this._value = newVal;

            // trigger
            triggerRefValue(this);
        }

    }
}
function trackRefValue(ref: RefImpl) {
    if (activeEffect) {
        ref.dep = createDep('undefind', () => ref.dep = undefined);
        trackEffect(activeEffect, ref.dep);
    }
}

function triggerRefValue(ref: RefImpl) {
    triggerEffects(ref.dep)
}