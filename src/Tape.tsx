export class Tape {
    private items: string[] = [];
    private name: string;
    private pointer: number;

    constructor(name: string) { 
        this.name = name;  // Store the name
        this.pointer = 0;
        this.items.push("#");
        this.items.push("#");
    }

    // Push an element onto the array
    push(item: string): void {
        this.items.pop()
        this.items.push(item);
        this.items.push("#")
    }

    // Push each character onto items array
    pushString(input: string): void{
        this.items.pop();
        const charArr: string[] = input.split("");
        charArr.forEach((str)=>{
            this.items.push(str);
        })
        this.items.push("#")
    }

    clearItems(): void{
        this.items = [];
        this.items.push("#");
        this.items.push("#");
        this.pointer = 0;
    }

    // Replace symbol of pointed index onto the tape
    replace(newSymbol: string): void{
        this.items[this.pointer] = newSymbol;
    }

    movePointerRight(): void{
        this.pointer = this.pointer += 1;
    }

    movePointerLeft(): void{
        this.pointer = this.pointer -= 1;
    }

    getPointerSymbol(): string{
        return this.items[this.pointer];
    }

    // Get the size of the stack
    size(): number {
        return this.items.length;
    }

    getName(): string{
        return this.name;
    }

    getPointer(): number{
        return this.pointer;
    }

    printItems(): void{
        let itemString: string = "";
        this.items.forEach((item)=>{itemString += item})
        console.log(itemString)
    }
}

export class Tape_2D{
    private items: string[][] = [];
    private name: string;
    private pointer_x: number;
    private pointer_y: number;

    constructor(name: string) { 
        this.name = name;  // Store the name
        this.pointer_x = 0;
        this.pointer_y = 0
        this.items[0].push("#");
        this.items[0].push("#");
    }

    getName():string{
        return this.name
    }
}