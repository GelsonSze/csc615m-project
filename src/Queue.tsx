export class Queue<T> {
    private items: T[] = [];
    private name: string;

    constructor(name: string) { 
        this.name = name; 
    }

    // Enqueue an element to the queue
    enqueue(item: T): void {
        this.items.push(item);
    }

    // Dequeue an element from the queue
    dequeue(): T | undefined {
        return this.items.shift();
    }

    // Check if the queue is empty
    isEmpty(): boolean {
        return this.items.length === 0;
    }

    // Get the size of the queue
    size(): number {
        return this.items.length;
    }

    // Clear the queue
    clear(): void {
        this.items = [];
    }

    getName(): string{
        return this.name;
    }
}