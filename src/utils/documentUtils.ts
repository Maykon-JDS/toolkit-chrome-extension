function random(number: number) {
    return Math.round(Math.random() * number);
}

function mod(dividend: number, divisor: number) {
    return Math.round(dividend - (Math.floor(dividend / divisor) * divisor));
}

function generateCPF(formatted: boolean = true) {
    const num1 = random(9);
    const num2 = random(9);
    const num3 = random(9);
    const num4 = random(9);
    const num5 = random(9);
    const num6 = random(9);
    const num7 = random(9);
    const num8 = random(9);
    const num9 = random(9);

    let d1 = num9 * 2 + num8 * 3 + num7 * 4 + num6 * 5 + num5 * 6 + num4 * 7 + num3 * 8 + num2 * 9 + num1 * 10;
    d1 = 11 - (mod(d1, 11));
    if (d1 >= 10) d1 = 0;

    let d2 = d1 * 2 + num9 * 3 + num8 * 4 + num7 * 5 + num6 * 6 + num5 * 7 + num4 * 8 + num3 * 9 + num2 * 10 + num1 * 11;
    d2 = 11 - (mod(d2, 11));
    if (d2 >= 10) d2 = 0;

    if (formatted) {
        return `${num1}${num2}${num3}.${num4}${num5}${num6}.${num7}${num8}${num9}-${d1}${d2}`;
    }
    return `${num1}${num2}${num3}${num4}${num5}${num6}${num7}${num8}${num9}${d1}${d2}`;
}

function generateCNPJ(formatted: boolean = true) {
    const n1 = random(9);
    const n2 = random(9);
    const n3 = random(9);
    const n4 = random(9);
    const n5 = random(9);
    const n6 = random(9);
    const n7 = random(9);
    const n8 = random(9);
    const n9 = 0; // Or another logic for branch number
    const n10 = 0;
    const n11 = 0;
    const n12 = 1;

    let d1 = n12 * 2 + n11 * 3 + n10 * 4 + n9 * 5 + n8 * 6 + n7 * 7 + n6 * 8 + n5 * 9 + n4 * 2 + n3 * 3 + n2 * 4 + n1 * 5;
    d1 = 11 - (mod(d1, 11));
    if (d1 >= 10) d1 = 0;

    let d2 = d1 * 2 + n12 * 3 + n11 * 4 + n10 * 5 + n9 * 6 + n8 * 7 + n7 * 8 + n6 * 9 + n5 * 2 + n4 * 3 + n3 * 4 + n2 * 5 + n1 * 6;
    d2 = 11 - (mod(d2, 11));
    if (d2 >= 10) d2 = 0;

    if (formatted) {
        return `${n1}${n2}.${n3}${n4}${n5}.${n6}${n7}${n8}/${n9}${n10}${n11}${n12}-${d1}${d2}`;
    }
    return `${n1}${n2}${n3}${n4}${n5}${n6}${n7}${n8}${n9}${n10}${n11}${n12}${d1}${d2}`;
}

function generateNFeKey(
    uf: string = '35', 
    includeHomologationCNPJ: boolean = false, 
    modelo: string = '55', 
    emitterType: 'CNPJ' | 'CPF' = 'CNPJ'
) {
    // UF: 2 digits (e.g., 35 for SP)
    // AAMM: 4 digits (year and month)
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const aamm = `${year}${month}`;
    
    // Emitter ID: 14 digits.
    let emitterId = '';
    if (emitterType === 'CPF') {
        const cpfRaw = generateCPF(false); // 11 digits
        emitterId = '000' + cpfRaw;
    } else {
        // CNPJ: 14 digits. Using a specific homologation CNPJ if requested, else generate a valid one.
        // 99.999.999/0001-91 is commonly used in SEFAZ homologation.
        emitterId = includeHomologationCNPJ ? '99999999000191' : generateCNPJ(false);
    }
    
    // Modelo: 2 digits
    const modeloFormatado = ('00' + modelo).slice(-2);
    
    // Série: 3 digits. 
    // Produtor Rural (CPF) usually uses series 920-969, but for now we generate random.
    const serie = ('000' + (emitterType === 'CPF' ? (920 + Math.floor(Math.random() * 50)) : Math.floor(Math.random() * 999))).slice(-3);
    
    // Número da NF: 9 digits
    const numero = ('000000000' + Math.floor(Math.random() * 999999999)).slice(-9);
    // Forma de Emissão: 1 digit (1 = Normal)
    const tpEmis = '1';
    // Código Numérico: 8 digits
    const cNF = ('00000000' + Math.floor(Math.random() * 99999999)).slice(-8);

    const key = `${uf}${aamm}${emitterId}${modeloFormatado}${serie}${numero}${tpEmis}${cNF}`;

    // Calculate DV (Check Digit) modulo 11
    let sum = 0;
    let weight = 2;
    for (let i = 42; i >= 0; i--) {
        sum += parseInt(key[i]!) * weight;
        weight++;
        if (weight > 9) {
            weight = 2;
        }
    }

    const remainder = sum % 11;
    let dv = 11 - remainder;
    if (dv === 10 || dv === 11) {
        dv = 0;
    }

    return key + dv.toString();
}

export { generateCPF, generateCNPJ, generateNFeKey };