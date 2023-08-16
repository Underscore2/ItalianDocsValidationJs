export class InvalidInputError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "InvalidInputError";
    }
  }

export class InvalidRegexError extends Error{
    constructor(message:string){
        super(message);
        this.name='InvalidRegexError'
    }
}
