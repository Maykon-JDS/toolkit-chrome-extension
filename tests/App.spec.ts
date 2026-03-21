import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../src/App.vue';
import PrimeVue from 'primevue/config';
import Sidebar from 'primevue/sidebar';

describe('App.vue', () => {
  it('should have a hamburger button that opens the Sidebar', async () => {
    const wrapper = mount(App, {
      global: {
        plugins: [PrimeVue],
        components: { Sidebar },
        stubs: {
          Generator: true,
          Notepad: true,
          Settings: true,
          ThemeToggle: true
        }
      }
    });

    // Check if the hamburger menu button exists
    const hamburgerBtn = wrapper.find('.hamburger-menu');
    expect(hamburgerBtn.exists()).toBe(true);

    // Sidebar should be in the DOM but hidden (visible=false)
    const sidebar = wrapper.findComponent(Sidebar);
    expect(sidebar.exists()).toBe(true);
    expect(sidebar.props('visible')).toBe(false);

    // Click hamburger menu
    await hamburgerBtn.trigger('click');

    // Sidebar should now be visible
    expect(sidebar.props('visible')).toBe(true);
  });
});
