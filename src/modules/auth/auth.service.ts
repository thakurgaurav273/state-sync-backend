import { HttpException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateAuthDto } from "./dto/create-auth.dto";
import { Response } from "express";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService
  ) {}
  async login(createAuthDto: CreateAuthDto, res: Response) {
    const { email, password } = createAuthDto;
    try {
      const existingUserData = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!existingUserData) {
        throw new HttpException("User doesn't exists please signup!", 401);
      }
      const isPasswordValid = bcrypt.compare(password, existingUserData.password);
      if (!isPasswordValid) {
        throw new HttpException("Invalid credentials", 401);
      }
      const { password: _, ...userWithoutPassword } = existingUserData;
      const payload = userWithoutPassword;
      const token = this.jwtService.sign(payload);
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return {
        access_token: token,
      };
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
