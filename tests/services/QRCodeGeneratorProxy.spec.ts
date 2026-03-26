import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QRCodeGeneratorProxy } from '../../src/services/qrcode/QRCodeGeneratorProxy';
import { QRCodeGenerator } from '../../src/services/qrcode/QRCodeGenerator';

describe('QRCodeGeneratorProxy', () => {
  let mockRealGenerator: QRCodeGenerator;
  let proxy: QRCodeGeneratorProxy;

  beforeEach(() => {
    mockRealGenerator = {
      generate: vi.fn().mockResolvedValue('data:image/png;base64,mockedDataURL'),
    };
    proxy = new QRCodeGeneratorProxy(mockRealGenerator);
  });

  it('should call the real generator when generating for the first time', async () => {
    const text = 'hello';
    const result = await proxy.generate(text);

    expect(result).toBe('data:image/png;base64,mockedDataURL');
    expect(mockRealGenerator.generate).toHaveBeenCalledTimes(1);
    expect(mockRealGenerator.generate).toHaveBeenCalledWith(text);
  });

  it('should return cached result and NOT call the real generator when text is the same', async () => {
    const text = 'hello';
    
    // First call
    await proxy.generate(text);
    
    // Second call with same text
    const result2 = await proxy.generate(text);

    expect(result2).toBe('data:image/png;base64,mockedDataURL');
    expect(mockRealGenerator.generate).toHaveBeenCalledTimes(1); // Still 1
  });

  it('should call the real generator again if the text changes', async () => {
    // First call
    await proxy.generate('hello');
    
    // Second call with DIFFERENT text
    await proxy.generate('world');

    expect(mockRealGenerator.generate).toHaveBeenCalledTimes(2);
    expect(mockRealGenerator.generate).toHaveBeenCalledWith('hello');
    expect(mockRealGenerator.generate).toHaveBeenCalledWith('world');
  });
});
