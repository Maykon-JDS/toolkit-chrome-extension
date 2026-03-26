import * as QRCode from 'qrcode';
import type { QRCodeGenerator } from './QRCodeGenerator';

export class RealQRCodeGenerator implements QRCodeGenerator {
  async generate(text: string): Promise<string> {
    if (!text) return '';
    
    try {
      return await QRCode.toDataURL(text, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000ff',
          light: '#ffffffff'
        }
      });
    } catch (err) {
      console.error('Error generating QR code:', err);
      return '';
    }
  }
}
