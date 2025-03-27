export class Queue {
    private items: string[] = [];
    private name: string;

    constructor(name: string) { 
        this.name = name; 
    }

    // Enqueue an element to the queue
    enqueue(item: string): void {
        this.items.push(item);
    }

    // Dequeue an element from the queue
    dequeue(): string | undefined {
        const symbol = this.items.shift();
        if(symbol == undefined){
            return "#";
        }
        return symbol;
    }

    nextSymbol(): string{
        return this.items[0]
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

    getItems(): string[]{
        return this.items;
    }
}