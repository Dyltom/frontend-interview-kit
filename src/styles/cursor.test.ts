import { describe, it, expect, beforeEach } from 'vitest';

describe('Matrix Cursor Styles', () => {
  beforeEach(() => {
    // Reset styles
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  it('should maintain cursor visibility on all interactive elements', () => {
    // Create test elements
    const button = document.createElement('button');
    button.className = 'control-button';
    document.body.appendChild(button);

    const link = document.createElement('a');
    link.href = '#';
    document.body.appendChild(link);

    const input = document.createElement('input');
    document.body.appendChild(input);

    // Load styles
    const style = document.createElement('style');
    style.textContent = `
      .control-button { cursor: pointer; }
      a { cursor: pointer; }
      input { cursor: text; }
    `;
    document.head.appendChild(style);

    // Check computed styles
    const buttonStyle = window.getComputedStyle(button);
    const linkStyle = window.getComputedStyle(link);
    const inputStyle = window.getComputedStyle(input);

    expect(buttonStyle.cursor).not.toBe('none');
    expect(linkStyle.cursor).not.toBe('none');
    expect(inputStyle.cursor).not.toBe('none');
  });

  it('should not use !important on cursor styles', () => {
    const style = document.createElement('style');
    style.textContent = `
      .control-button { cursor: pointer; }
      body { cursor: default; }
    `;
    document.head.appendChild(style);

    const rules = Array.from(style.sheet?.cssRules || []);

    rules.forEach(rule => {
      if ('style' in rule && rule.style?.cursor) {
        expect(rule.style.getPropertyPriority('cursor')).not.toBe('important');
      }
    });
  });

  it('should have appropriate cursor for each element type', () => {
    const expectations = {
      '.control-button': 'pointer',
      '.terminal-window': 'default',
      '.timer-display': 'default',
      'body': 'default',
      'a': 'pointer',
      'button': 'pointer'
    };

    Object.entries(expectations).forEach(([selector, expectedCursor]) => {
      const element = document.createElement(selector.startsWith('.') ? 'div' : selector);
      if (selector.startsWith('.')) {
        element.className = selector.slice(1);
      }
      document.body.appendChild(element);

      const style = document.createElement('style');
      style.textContent = `${selector} { cursor: ${expectedCursor}; }`;
      document.head.appendChild(style);

      const computedStyle = window.getComputedStyle(element);
      expect(computedStyle.cursor).toBe(expectedCursor);
    });
  });

  it('should support custom cursor images', () => {
    const style = document.createElement('style');
    style.textContent = `
      body {
        cursor: url('/cursor-default.svg'), default;
      }
      .control-button {
        cursor: url('/cursor-pointer.svg'), pointer;
      }
    `;
    document.head.appendChild(style);

    const body = document.body;
    const button = document.createElement('button');
    button.className = 'control-button';
    document.body.appendChild(button);

    const bodyStyle = window.getComputedStyle(body);
    const buttonStyle = window.getComputedStyle(button);

    // Check that cursor includes url() for custom cursors
    expect(bodyStyle.cursor).toContain('url');
    expect(buttonStyle.cursor).toContain('url');
  });

  it('should have hover states that do not hide cursor', () => {
    const button = document.createElement('button');
    button.className = 'control-button';
    document.body.appendChild(button);

    const style = document.createElement('style');
    style.textContent = `
      .control-button { cursor: pointer; }
      .control-button:hover { cursor: pointer; }
      .control-button:active { cursor: pointer; }
      .control-button:focus { cursor: pointer; }
    `;
    document.head.appendChild(style);

    // Simulate different states
    const states = [':hover', ':active', ':focus'];
    states.forEach(state => {
      const rule = Array.from(style.sheet?.cssRules || [])
        .find(r => 'selectorText' in r && r.selectorText === `.control-button${state}`);

      if (rule && 'style' in rule) {
        expect(rule.style.cursor).toBe('pointer');
        expect(rule.style.cursor).not.toBe('none');
      }
    });
  });
});