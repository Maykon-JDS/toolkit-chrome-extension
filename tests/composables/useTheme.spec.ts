import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { useTheme } from '../../src/composables/useTheme';

describe('useTheme', () => {
    beforeEach(() => {
        // Mock matchMedia
        Object.defineProperty(window, 'matchMedia', {
            writable: true,
            value: vi.fn().mockImplementation(query => ({
                matches: false,
                media: query,
                onchange: null,
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn(),
            })),
        });

        // Mock localStorage
        const localStorageMock = (() => {
            let store: Record<string, string> = {};
            return {
                getItem(key: string) {
                    return store[key] || null;
                },
                setItem(key: string, value: string) {
                    store[key] = value.toString();
                },
                clear() {
                    store = {};
                }
            };
        })();
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock
        });
        window.localStorage.clear();

        // Clear document body generic attrs
        document.documentElement.removeAttribute('data-theme');
    });

    it('should initialize with system theme', () => {
        const TestComponent = {
            setup() {
                const { theme } = useTheme();
                return { theme };
            },
            template: '<div>{{ theme }}</div>'
        };
        const wrapper = mount(TestComponent);
        expect(wrapper.vm.theme).toBe('system');
    });
});
