import { describe, it, expect } from 'vitest';
import { generateCPF, generateCNPJ, generateNFeKey } from '../../src/utils/documentUtils';

describe('documentUtils', () => {
    describe('generateCPF', () => {
        it('should generate a formatted CPF', () => {
            const cpf = generateCPF(true);
            expect(cpf).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
        });
        
        it('should generate an unformatted CPF', () => {
            const cpf = generateCPF(false);
            expect(cpf).toMatch(/^\d{11}$/);
        });
        
        it('should generate a valid CPF (check digits validation)', () => {
            const cpf = generateCPF(false);
            const digits = cpf.split('').map(Number);
            const d1 = digits[9];
            const d2 = digits[10];
            
            let sum1 = 0;
            for (let i = 0; i < 9; i++) {
                sum1 += digits[i] * (10 - i);
            }
            let check1 = 11 - (sum1 % 11);
            if (check1 >= 10) check1 = 0;
            expect(d1).toBe(check1);
            
            let sum2 = 0;
            for (let i = 0; i < 10; i++) {
                sum2 += digits[i] * (11 - i);
            }
            let check2 = 11 - (sum2 % 11);
            if (check2 >= 10) check2 = 0;
            expect(d2).toBe(check2);
        });
    });

    describe('generateCNPJ', () => {
        it('should generate a formatted CNPJ', () => {
            const cnpj = generateCNPJ(true);
            expect(cnpj).toMatch(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
        });

        it('should generate an unformatted CNPJ', () => {
            const cnpj = generateCNPJ(false);
            expect(cnpj).toMatch(/^\d{14}$/);
        });
    });

    describe('generateNFeKey', () => {
        it('should generate a 44-digit NFe Key for CNPJ', () => {
            const key = generateNFeKey('35', false, '55', 'CNPJ');
            expect(key).toMatch(/^\d{44}$/);
            expect(key.startsWith('35')).toBe(true);
        });

        it('should generate a 44-digit NFe Key for CPF', () => {
            const key = generateNFeKey('35', false, '55', 'CPF');
            expect(key).toMatch(/^\d{44}$/);
            expect(key.substring(6, 9)).toBe('000'); 
        });
        
        it('should handle homologation CNPJ', () => {
             const key = generateNFeKey('35', true, '55', 'CNPJ');
             expect(key).toMatch(/^\d{44}$/);
             expect(key.substring(6, 20)).toBe('99999999000191');
        });
        
        it('should check modulo 11 validation for NFe Key', () => {
             const key = generateNFeKey('35', false, '55', 'CNPJ');
             const keyWithoutDV = key.substring(0, 43);
             const dv = parseInt(key[43], 10);
            
             let sum = 0;
             let weight = 2;
             for (let i = 42; i >= 0; i--) {
                 sum += parseInt(keyWithoutDV[i]!) * weight;
                 weight++;
                 if (weight > 9) {
                     weight = 2;
                 }
             }
             const remainder = sum % 11;
             let calculatedDv = 11 - remainder;
             if (calculatedDv === 10 || calculatedDv === 11) calculatedDv = 0;

             expect(dv).toBe(calculatedDv);
        });
    });
});
