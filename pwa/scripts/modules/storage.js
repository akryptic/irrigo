import { $signal, Signal } from "./signal.js";

/**
 * A function that creates a reactive storage object
 *@template T
 *
 * @param {string} key - The key to store the value in the storage
 * @param {T} initialValue  - The initial value of the storage
 * @param {{callback: function?, mode: "encoded" | "normal" | undefined}} options - The callback function to be called when the value is changed
 *
 * @returns {Signal<T>} - A signal object
 */
export function createStorage(key, initialValue, options) {
  const { callback, mode } = options;
  /**
   * @type {T}
   */
  let value;

  value =
    (mode === "encoded"
      ? JSON.parse(localStorage.getItem(key))
      : localStorage.getItem(key)) || initialValue;

  /**
   * Create the signal
   * @type {Signal<T>}
   */
  const signal = $signal(value);

  /**
   * Subscribe to the signal
   *
   */
  signal.subscribe((newValue) => {
    mode === "encoded"
      ? localStorage.setItem(key, JSON.stringify(newValue))
      : localStorage.setItem(key, newValue);
    if (callback) callback(newValue);
  });

  signal.value = value

  return signal;
}
