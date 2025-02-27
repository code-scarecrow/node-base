import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { Client } from './Client';
import { QueueInterceptor } from '../logger';

export abstract class EventClient<T> extends Client<T> {
	private exchange: string;
	private key: string;

	constructor(
		exchange: string,
		key: string,
		queueClient: AmqpConnection,
		interceptor: QueueInterceptor,
		appName: string,
	) {
		super(queueClient, interceptor, appName);
		this.exchange = exchange;
		this.key = key;
	}

	public publish(data: T): void {
		this.queueClient.channel.publish(this.exchange, this.key, this.createMessage(data));
	}
}
