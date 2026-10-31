export class Emitter {
  #listeners = new Map();

  /** Subscribe. Returns a function that removes this subscription. */
  on(event, listener) {
    if (typeof listener !== "function") throw new TypeError("listener must be a function");
    const set = this.#listeners.get(event) ?? new Set();
    set.add(listener);
    this.#listeners.set(event, set);
    return () => this.off(event, listener);
  }

  once(event, listener) {
    const wrapper = (...args) => {
      this.off(event, wrapper);
      return listener(...args);
    };
    wrapper.original = listener;
    return this.on(event, wrapper);
  }

  off(event, listener) {
    const set = this.#listeners.get(event);
    if (!set) return false;
    for (const l of set) {
      if (l === listener || l.original === listener) {
        set.delete(l);
        if (set.size === 0) this.#listeners.delete(event);
        return true;
      }
    }
    return false;
  }

  /** Call listeners in subscription order. Returns true if any ran. */
  emit(event, ...args) {
    const set = this.#listeners.get(event);
    if (!set) return false;
    for (const listener of [...set]) listener(...args);
    return true;
  }

  listenerCount(event) {
    return this.#listeners.get(event)?.size ?? 0;
  }

  removeAll(event) {
    if (event === undefined) this.#listeners.clear();
    else this.#listeners.delete(event);
  }
}
