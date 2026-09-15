export class AppError extends Error{
    statusCode: number;
    code: string;

    constructor(code: string, message:string, statusCode:number){
        super(message);
        this.code = code
        this.statusCode = statusCode
    }
}

export class SeatUnavailableError extends AppError{
    constructor(){
        super('SEAT_UNAVAILABLE', 'This seat is already booked for this showtime', 409)
    }
}

export class ValidationError extends AppError{
    constructor(message: string){
        super('VALIDATION_ERROR', message, 400)
    }
}
