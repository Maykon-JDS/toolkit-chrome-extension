import type { QRCodeGenerator } from './QRCodeGenerator';

export class QRCodeGeneratorProxy implements QRCodeGenerator {
  private cachedText: string | null = null;
  private cachedResult: string | null = null;
  private realGenerator: QRCodeGenerator;

  constructor(realGenerator: QRCodeGenerator) {
    this.realGenerator = realGenerator;
  }

  async generate(text: string): Promise<string> {
    if (this.cachedText === text && this.cachedResult !== null) {
      return this.cachedResult;
    }

    this.cachedResult = await this.realGenerator.generate(text);
    this.cachedText = text;
    return this.cachedResult;
  }
}
