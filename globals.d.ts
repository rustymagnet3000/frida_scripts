export {};

declare global {
    const console: {
        log(...args: string[]): void;
        error(...args: string[]): void;
        warn(...args: string[]): void;
    };
}