import { StateTypes } from "./globals";
export class State {
    private name: string;
    private type: StateTypes;

    constructor(name: string, type: StateTypes) { 
        this.name = name; 
        this.type = type; 
    }


}