import {IsEmail, IsNotEmpty, MinLength} from "class-validator";

export class CreatedUserDto {
  @IsNotEmpty({ message: "Le nom d'utilisateur ne peut pas être vide" })
  @MinLength(3, { message: "Le mot de passe doit contenir au moins 6 caractères" })
  username: string;

  @IsNotEmpty({ message: "L'email ne peut pas être vide" })
  @IsEmail({}, { message: "L'email doit être une adresse email valide" })
  email: string;

  @IsNotEmpty({ message: "Le mot de passe ne peut pas être vide" })
  @MinLength(6, { message: "Le mot de passe doit contenir au moins 6 caractères" })
  password: string;
}