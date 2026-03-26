export interface QRCodeGenerator {
  generate(text: string): Promise<string>;
}
