import { Meteor } from "meteor/meteor";

type AnyMethod = (...args: any[]) => any;
type NeverReturnPromise<TRun extends AnyMethod> = TRun extends (...args: any[]) => Promise<infer T> ? T : ReturnType<TRun>;
type AlwaysReturnPromise<TRun extends AnyMethod> = Promise<NeverReturnPromise<TRun>>;
type TypedMethodProps<TRun extends AnyMethod> = {
  name: string;
  guard?: (this: Meteor.MethodThisType) => void;
  run: TRun;
  isServerSide?: boolean;
} & ThisType<Meteor.MethodThisType>;
export class TypedMethod<TRun extends AnyMethod> {
  private readonly name: string;
  constructor({ name, run, guard, isServerSide }: TypedMethodProps<TRun>) {
    guard ??= function () {
      if (!this.userId && (this.connection || this.isSimulation)) throw new Meteor.Error("not-authorized", "You must be logged in");
    };
    this.name = name;
    if (isServerSide && !Meteor.isServer) return;
    Meteor.methods({
      async [name](...args) {
        guard?.bind(this)();
        return run.bind(this)(...args);
      },
    });
  }
  call = async (...args: Parameters<TRun>): AlwaysReturnPromise<TRun> =>
    new Promise((resolve, reject) => Meteor.apply(this.name, args, {}, (err, res: any) => (err ? reject(err) : resolve(res))));
}
