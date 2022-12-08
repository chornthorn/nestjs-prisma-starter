import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import { BadRequestException } from '@nestjs/common';

export class UtilityHelper {
  static async hasString(normalString: string): Promise<string> {
    return await bcrypt.hash(normalString, 10);
  }

  static async compareString(
    normalString: string,
    hash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(normalString, hash);
  }

  // validate uuid
  static isUuid(id: string): boolean {
    const uuid = id.match(
      /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/,
    );
    return !!uuid;
  }

  // delete local file
  static async deleteLocalFile(path: string): Promise<void> {
    try {
      await fs.unlink(path, (err) => {
        if (err) {
          throw new BadRequestException(err.message);
        }
      });
    } catch (error) {
      throw new BadRequestException('File not deleted');
    }
  }

  // check file path valid or not
  static isFileExists(path: string): boolean {
    return fs.existsSync(path);
  }

  //generateRandomString
  static generateRandomString(length: number): string {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
