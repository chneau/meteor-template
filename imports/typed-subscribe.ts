import { Meteor, type Subscription } from "meteor/meteor";
import type { Mongo } from "meteor/mongo";

type CursorFn = (...args: any[]) => Mongo.Cursor<any>;
type CursorType<TRun extends CursorFn> = ReturnType<TRun> extends Mongo.Cursor<
	infer T,
	any
>
	? T
	: never;

type ConstructorProps<TRun extends CursorFn> = {
	name: string;
	guard?: (this: Subscription, ...args: Parameters<TRun>) => boolean;
	run: TRun;
};

export class TypedSubscribe<TRun extends CursorFn> {
	private readonly name: string;
	private readonly run: TRun;
	constructor({ name, guard, run }: ConstructorProps<TRun>) {
		this.name = name;
		this.run = run;
		guard ??= function () {
			return !!this.userId;
		};
		Meteor.publish?.(name, function (...args) {
			const guardResult = guard?.bind(this)(...(args as Parameters<TRun>));
			if (!guardResult) return this.ready();
			return run.bind(this)(...(args as Parameters<TRun>));
		});
	}
	fetch = (...args: Parameters<TRun>): CursorType<TRun>[] => {
		Meteor.subscribe?.(this.name, ...args);
		return this.run(...args).fetch();
	};
}
