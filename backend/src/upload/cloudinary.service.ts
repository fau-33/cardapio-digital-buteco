import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import sharp from 'sharp';

@Injectable()
export class CloudinaryService {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name:
        this.configService.get<string>('CLOUDINARY_CLOUD_NAME') ||
        process.env.CLOUDINARY_CLOUD_NAME ||
        'zcg5o50x',
      api_key:
        this.configService.get<string>('CLOUDINARY_API_KEY') ||
        process.env.CLOUDINARY_API_KEY ||
        '118441877883824',
      api_secret:
        this.configService.get<string>('CLOUDINARY_API_SECRET') ||
        process.env.CLOUDINARY_API_SECRET ||
        'kgZo3GWxNEa8XJwywmHJJ2_JiFs',
    });
  }

  async uploadProductImage(fileBuffer: Buffer): Promise<{
    url: string;
    secure_url: string;
    publicId: string;
    width: number;
    height: number;
  }> {
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new BadRequestException('Arquivo de imagem inválido ou vazio.');
    }

    let optimizedBuffer: Buffer;
    try {
      optimizedBuffer = await sharp(fileBuffer)
        .rotate()
        .flatten({ background: { r: 255, g: 255, b: 255 } })
        .resize(800, 520, {
          fit: 'cover',
          position: sharp.strategy.attention,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .sharpen({ sigma: 0.85 })
        .jpeg({ quality: 86, mozjpeg: true })
        .toBuffer();
    } catch {
      throw new BadRequestException(
        'Não foi possível processar a imagem enviada. Verifique o formato do arquivo.',
      );
    }

    try {
      const uploadResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: 'buteco-do-papa/produtos',
              resource_type: 'image',
              format: 'jpg',
            },
            (error, result) => {
              if (error || !result) {
                return reject(
                  error ?? new Error('Falha ao enviar imagem ao Cloudinary.'),
                );
              }
              resolve(result);
            },
          );

          stream.end(optimizedBuffer);
        },
      );

      return {
        url: uploadResult.secure_url,
        secure_url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        width: uploadResult.width,
        height: uploadResult.height,
      };
    } catch {
      throw new InternalServerErrorException(
        'Erro ao salvar a imagem otimizada no Cloudinary.',
      );
    }
  }
}
