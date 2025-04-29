export class SafeMap<K, V> extends Map<K, V> {
  get(key: K): V {
    const v = super.get(key);
    if (!v) throw new Error('key not found in map');
    return v;
  }
}
