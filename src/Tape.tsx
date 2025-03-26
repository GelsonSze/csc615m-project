export class Tape {
    private items: string[] = [];
    private name: string;
    private pointer: number;

    constructor(name: string) { 
        this.name = name; 
        this.pointer = 0;
        this.items.push("#");
        this.items.push("#");
    }

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
        this.pointer += 1;
        if(this.pointer >= this.items.length){
            this.items.push("#");
        }
    }

    movePointerLeft(): void{
        this.pointer -= 1;
        if(this.pointer < 0 ){
            throw Error("Going beyond left limit of tape")
        }
    }

    getPointerSymbol(): string{
        return this.items[this.pointer];
    }

    getName(): string{
        return this.name;
    }

    getLength(): number{
        return this.items.length;
    }

    getPointer(): number{
        return this.pointer;
    }

    setPointer(y: number): void{
        this.pointer = y;
    }

    printItems(): void{
        let itemString: string = "";
        this.items.forEach((item)=>{itemString += item})
        console.log(itemString)
    }
}

export class Tape_2D {
    private items: {[name: string]: Tape} = {};
    private name: string;
    private pointer_x: number;
    private pointer_y: number;

    constructor(name: string) { 
        this.name = name;  // Store the name
        this.pointer_x = 0;
        this.pointer_y = 0;
        this.items[0] = new Tape("0");
    }

    // for initializing tape only
    pushString(input: string): void{
        this.items[this.pointer_x].pushString(input);
    }

    clearItems(): void{
        this.items = {};
        this.items[0] = new Tape("0");
        this.items[0].pushString("#");
        this.pointer_x = 0;
        this.pointer_y = 0
    }

    // Replace symbol of pointed index onto the tape
    replace(newSymbol: string): void{
        const tape = this.items[this.pointer_x]
        tape.setPointer(this.pointer_y)
        tape.replace(newSymbol);
    }

    movePointerRight(): void{
        this.pointer_y += 1;
        if(this.pointer_y > this.items[this.pointer_x].getLength()){
            for(const key in this.items){
                this.items[key].pushString("#");
            }
        }
    }

    movePointerLeft(): void{
        this.pointer_y -= 1;
        if(this.pointer_y < 0){
            throw Error("Moved pointer beyond left limit of tape")
        }
    }

    movePointerUp(): void{
        this.pointer_x += 1
        if(!(this.pointer_x in this.items)){
            const numSymbols = this.items[this.pointer_x - 1].getLength()
            let strToPrint = ""
            for(let i = 0; i < numSymbols; i++){
                strToPrint += "#";
            }
            strToPrint = strToPrint.slice(0,-2);
            this.items[this.pointer_x] = new Tape(this.pointer_x.toString())
            this.items[this.pointer_x].pushString(strToPrint);
        }
    }

    movePointerDown(): void{
        this.pointer_x -= 1
        if(!(this.pointer_x in this.items)){
            const numSymbols = this.items[this.pointer_x + 1].getLength()
            let strToPrint = ""
            for(let i = 0; i < numSymbols; i++){
                strToPrint += "#";
            }
            strToPrint = strToPrint.slice(0,-2);
            this.items[this.pointer_x] = new Tape(this.pointer_x.toString())
            this.items[this.pointer_x].pushString(strToPrint);
        }
    }

    getPointerSymbol(): string{
        const tape = this.items[this.pointer_x];
        tape.setPointer(this.pointer_y);
        return tape.getPointerSymbol();
    }

    getItemRow(): Tape{
        return this.items[this.pointer_x];
    }

    getPointerX(): number{
        return this.pointer_x;
    }

    getPointerY(): number{
        return this.pointer_y;
    }
    
    getName(): string{
        return this.name
    }

}