export class Stack {
    private items: string[] = [];
    private name: string;

    constructor(name: string) { 
        this.name = name;  // Store the queue name
    }

    // Push an element onto the stack
    push(item: string): void {
        this.items.push(item);
    }

    // Pop the top element off the stack
    pop(): string | undefined {
        return this.items.pop();
    }

    nextSymbol(): string{
        return this.items[this.items.length-1]
    }
    
    // Check if the stack is empty
    isEmpty(): boolean {
        return this.items.length === 0;
    }

    // Get the size of the stack
    size(): number {
        return this.items.length;
    }

    // Clear the stack
    clear(): void {
        this.items = [];
    }

    getName(): string{
        return this.name;
    }

    printItems(): void {
        console.log(this.items.toString())
    }
}