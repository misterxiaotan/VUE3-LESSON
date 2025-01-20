export function effect(fn: any, options: any) {
    const _effect = new ReactiveEffect(fn, () => {
        _effect.run();
    })
}

export let activeEffect: ReactiveEffect | null;


function preCleanEffect(effect: ReactiveEffect) {
    effect._dep_length = 0;
    effect._trackId++;
}

class ReactiveEffect {
    public active = true;
    public _trackId = 0; // 当前effcet 执行的次数
    public _dep_length = 0; // 当前 deps 数组的长度
    public deps = [] as Map<any, any>[];
    constructor(public fn: any, public scheduler: () => void) {
        this.run(); //依赖收集
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
}

export function trackEffect(effect: ReactiveEffect, dep: Map<any, any>) {
    // 重新收集依赖，将不需要的移除掉
    // console.log(effect, dep, 'effect && dep')
    if (dep.get(effect) !== effect._trackId) {
        dep.set(effect, effect._trackId);

        let oldDep = effect.deps[effect._dep_length];
        if (oldDep !== dep) {
            if (oldDep) {
                (oldDep as any).clearUp()
            }
            effect.deps[effect._dep_length++] = dep;
        } else {
            effect._dep_length++
        }
    }
    console.log('优化了多余的收集')

}
