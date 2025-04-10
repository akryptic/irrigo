/**
 * Class representing a reactive Signal.
 * @template T
 */
export class Signal {
  /**
   * Creates a Signal object.
   * @param {T} value - The initial value of the signal.
   */
  constructor(value) {
    /**
     * The current value of the signal.
     * @type {T}
     * @private
     */
    this._subscribers = [];

    this._value = this._makeReactive(value);
  }

  /**
   * Gets the current value of the signal.
   * @returns {T} The current value.
   */
  get value() {
    return this._value;
  }

  /**
   * Sets a new value for the signal and emits the change to subscribers.
   * @param {T} newValue - The new value to set.
   */
  set value(newValue) {
    this._value = this._makeReactive(newValue);
    this.emit();
  }

  /**
   * Emits the current value to all subscribers.
   * @private
   */
  emit() {
    this._subscribers.forEach((subscriber) => subscriber(this._value));
  }

  /**
   * Subscribes a callback function to be called when the signal value changes.
   * @param {(newValue: T) => any} callback - The callback function to subscribe.
   */
  subscribe(callback) {
    this._subscribers.push(callback);
  }

  /**
   * Wraps an object or array in a Proxy to detect mutations.
   * @param {T} value - The value to make reactive.
   * @returns {T} - The reactive proxy or the primitive value.
   * @private
   */
  _makeReactive(value) {
    if (typeof value !== 'object' || value === null) {
      return value; // No need for proxy wrapping primitives
    }

    return new Proxy(value, {
      set: (target, prop, newValue) => {
        target[prop] = newValue;
        this.emit(); // Notify subscribers on property mutation
        return true;
      },
    });
  }
}

/**
 * @template T
 * @param {T} val
 * @returns {Signal<T>}
 */
export function $signal(val) {
  return new Signal(val);
}
