import { IsNotEmpty, IsString } from "class-validator";
// import Joi from "joi";
import * as Joi from 'joi';


export const createUserSchema = Joi.object({
    name: Joi.string().required()
})

export class CreateUserDto {
    @IsNotEmpty()
    @IsString()
    name: string;
}
