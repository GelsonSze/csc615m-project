export class Tape {
    private items: string[] = [];
    private name: string;
    private pointer: number;

    constructor(name: string) { 
        this.name = name;  // Store the name
        this.pointer = 0;
        this.push("#");
        this.push("#");
    }

    // Push an element onto the array
    push(item: string): void {
        this.items.push(item);
    }

    // Replace symbol of pointed index onto the tape
    replace(newSymbol: string): void{
        this.items[this.pointer] = newSymbol;
    }

    movePointer(newIndex: number, ){
        this.pointer = newIndex;
    }

    // Get the size of the stack
    size(): number {
        return this.items.length;
    }

    getName(): string{
        return this.name;
    }
}