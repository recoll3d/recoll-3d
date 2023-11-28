import { sign } from 'jsonwebtoken';
import { env } from 'process';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path'

import { prisma } from '../../../database/prismaClient';

interface IUser {
  email: string;
}

export class ForgotPasswordUseCase {
  async execute({ email }: IUser) {
    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("Invalid email!");
    }

    const resetTokenExists = await prisma.resetTokens.findFirst({
      where: {
        user_id: user.id,
      }
    });

    if (resetTokenExists) {
      await prisma.resetTokens.delete({
        where: {
          user_id: user.id,
        }
      });
    }

    const resetToken = sign({ email }, env.USER_MD5_HASH as string, {
      subject: user.id,
      expiresIn: "15m",
    });

    const now = new Date();

    const expires_at = now.setMinutes(now.getMinutes() + 15);

    const createResetToken = await prisma.resetTokens.create({
      data: {
        token: resetToken,
        expires_at: new Date(expires_at),
        user: {
          connect: {
            id: user.id
          }
        }
      }
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?${resetToken}`;

    const resend = new Resend(env.RESEND_KEY);

    const [firstName] = user.name.split(" ");

    const htmlFilePath = path.join(__dirname, "template", "index.html");

    let htmlContent = fs.readFileSync(htmlFilePath, "utf-8");

    htmlContent = htmlContent.replace("{{FIRST_NAME}}", firstName);
    htmlContent = htmlContent.replace("{{RESET_LINK}}", resetLink);

    const data = await resend.emails.send({
      from: `Recoll 3D <${env.ADMIN_EMAIL}>`,
      to: email,
      subject: 'Redefinição de senha',
      html: htmlContent,
    });

    const result = {
      email_data: data,
      reset_token: createResetToken
    }

    return result;
  }
};