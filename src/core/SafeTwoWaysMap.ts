import { SafeMap } from "./SafeMap";

export class SafeTwoWaysMap<K, V> {
	private readonly map: SafeMap<K, V>;
	private readonly reverseMap: SafeMap<V, K>;

	constructor(map: SafeMap<K, V>) {
		this.map = map;
		this.reverseMap = new SafeMap<V, K>();

		map.forEach((value, key) => {
			this.reverseMap.set(value, key);
		});
	}

	public get(key: K): V {
		return this.map.get(key);
	}

	public getRev(key: V): K {
		return this.reverseMap.get(key);
	}
}