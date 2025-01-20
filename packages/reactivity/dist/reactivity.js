// packages/reactivity/src/effect.ts
function effect(fn, options) {
  const _effect = new ReactiveEffect(fn, () => {
    _effect.run();
  });
}
var activeEffect;
function preCleanEffect(effect2) {
  effect2._dep_length = 0;
  effect2._trackId++;
}
var ReactiveEffect = class {
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this._trackId = 0;
    // 当前effcet 执行的次数
    this._dep_length = 0;
    // 当前 deps 数组的长度
    this.deps = [];
    this.run();
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let lastEffcet = activeEffect;
    try {
      activeEffect = this;
      preCleanEffect(this);
      return this.fn();
    } finally {
      activeEffect = lastEffcet;
    }
  }
  stop() {
    this.active = false;
  }
};
function trackEffect(effect2, dep) {
  if (dep.get(effect2) !== effect2._trackId) {
    dep.set(effect2, effect2._trackId);
    let oldDep = effect2.deps[effect2._dep_length];
    if (oldDep !== dep) {
      if (oldDep) {
        oldDep.clearUp();
      }
      effect2.deps[effect2._dep_length++] = dep;
    } else {
      effect2._dep_length++;
    }
  }
  console.log("\u4F18\u5316\u4E86\u591A\u4F59\u7684\u6536\u96C6");
}

// packages/shared/src/index.ts
function isObject(value) {
  return typeof value === "object" && value !== null;
}

// packages/reactivity/src/track.ts
var ReactiveMap = /* @__PURE__ */ new WeakMap();
function createDep(key, clearUp) {
  const dep = /* @__PURE__ */ new Map();
  dep.clearUp = clearUp;
  dep.name = key;
  return dep;
}
function track(target, key) {
  if (activeEffect) {
    let depsMap = ReactiveMap.get(target);
    if (!depsMap) {
      ReactiveMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep(key, () => depsMap.delete(key)));
    }
    trackEffect(activeEffect, dep);
    console.log(ReactiveMap, "ReactiveMap");
  }
}

// packages/reactivity/src/notify.ts
function notify(target, key, value, oldValue) {
  const notifyMap = ReactiveMap.get(target);
  if (notifyMap) {
    const dep = notifyMap.get(key);
    if (dep) {
      triggerEffects(dep);
    } else {
      console.log("\u6CA1\u6709\u8BE5\u4F9D\u8D56", key);
    }
  }
  console.log(ReactiveMap, "ReactiveMap");
}
function triggerEffects(dep) {
  console.log(dep, "triggerEffect");
  const keys = [...dep.keys()];
  keys.forEach((effect2) => {
    effect2.scheduler();
  });
}

// packages/reactivity/src/baseHandler.ts
var mutableHandlers = {
  get(target, key, receiver) {
    if (key === "__v_isReactive" /* IS_REACTIVE */) return true;
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
    return result;
  }
};

// packages/reactivity/src/reactive.ts
var reactiveMap = /* @__PURE__ */ new WeakMap();
function reactive(target) {
  if (!isObject(target)) return;
  if (target["__v_isReactive" /* IS_REACTIVE */]) return target;
  return createReactiveObject(target);
}
function createReactiveObject(target) {
  const exitsProxy = reactiveMap.get(target);
  if (exitsProxy) {
    return exitsProxy;
  } else {
    const proxy = new Proxy(target, mutableHandlers);
    reactiveMap.set(target, proxy);
    return proxy;
  }
}
function toReactive(value) {
  return isObject(value) ? reactive(value) : value;
}

// packages/reactivity/src/ref.ts
function ref(value) {
  return createRef(value);
}
function createRef(value) {
  return new RefImpl(value);
}
var RefImpl = class {
  constructor(_rawValue) {
    this._rawValue = _rawValue;
    this.__v_isRef = true;
    this._value = toReactive(_rawValue);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    if (newVal !== this._value) {
      this._rawValue = newVal;
      this._value = newVal;
      triggerRefValue(this);
    }
  }
};
function trackRefValue(ref2) {
  if (activeEffect) {
    ref2.dep = createDep("undefind", () => ref2.dep = void 0);
    trackEffect(activeEffect, ref2.dep);
  }
}
function triggerRefValue(ref2) {
  triggerEffects(ref2.dep);
}
export {
  activeEffect,
  effect,
  reactive,
  ref,
  toReactive,
  trackEffect
};
//# sourceMappingURL=reactivity.js.map
