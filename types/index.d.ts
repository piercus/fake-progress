interface Options {
    timeConstant: number;
    autoStart?: boolean;
    parent?: FakeProgress;
    parentStart?: number;
    parentEnd?: number;
}

declare module 'fake-progress' {
    export = FakeProgress;

    class FakeProgress {
        constructor(opts: Options);

        progress: number;

        createSubProgress(opts: Options): FakeProgress;

        end(): void;

        setProgress(progress: number): void;

        start(): void;

        stop(): void;
    }
}
