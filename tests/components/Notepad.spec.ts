import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Notepad from '../../src/components/features/Notepad.vue';
import { QRCodeGeneratorProxy } from '../../src/services/qrcode/QRCodeGeneratorProxy';

// Mock the proxy module
vi.mock('../../src/services/qrcode/QRCodeGeneratorProxy', () => {
  return {
    QRCodeGeneratorProxy: class {
      generate = vi.fn().mockResolvedValue('data:image/png;base64,mockedDataURL');
    }
  };
});

describe('Notepad.vue', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the textarea', () => {
    const wrapper = mount(Notepad);
    const textarea = wrapper.find('textarea');
    expect(textarea.exists()).toBe(true);
  });

  it('should have a generate QR code button above the textarea', () => {
    const wrapper = mount(Notepad);
    const button = wrapper.find('button.generate-qr-btn');
    expect(button.exists()).toBe(true);
    expect(button.text()).toContain('QR Code');
  });

  it('should display the generated QR code and hide textarea when button is clicked', async () => {
    const wrapper = mount(Notepad);
    
    // Set some text
    const textarea = wrapper.find('textarea');
    await textarea.setValue('Hello World');
    
    // Click button
    const button = wrapper.find('button.generate-qr-btn');
    await button.trigger('click');
    
    // Wait for async operations
    await new Promise(resolve => setTimeout(resolve, 0));
    
    const img = wrapper.find('img.qr-code-image');
    expect(img.exists()).toBe(true);
    
    // Textarea should be hidden
    expect(wrapper.find('textarea').exists()).toBe(false);
    expect(wrapper.find('button.generate-qr-btn').exists()).toBe(false);
  });

  it('should restore the textarea when close button is clicked', async () => {
    const wrapper = mount(Notepad);
    
    // Generate QR First
    await wrapper.find('textarea').setValue('Test');
    await wrapper.find('button.generate-qr-btn').trigger('click');
    await new Promise(resolve => setTimeout(resolve, 0));
    
    // Click close button
    const closeBtn = wrapper.find('button.close-qr-btn');
    expect(closeBtn.exists()).toBe(true);
    await closeBtn.trigger('click');
    
    // Textarea should be visible again
    expect(wrapper.find('textarea').exists()).toBe(true);
    expect(wrapper.find('img.qr-code-image').exists()).toBe(false);
  });
});
