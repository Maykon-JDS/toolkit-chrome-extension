function random(number: number) {
    return Math.round(Math.random() * number);
}

function mod(dividend: number, divisor: number) {
    return Math.round(dividend - (Math.floor(dividend / divisor) * divisor));
}

function generateCPF() {
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

    return `${num1}${num2}${num3}.${num4}${num5}${num6}.${num7}${num8}${num9}-${d1}${d2}`;
}

function generateCNPJ() {
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

    return `${n1}${n2}.${n3}${n4}${n5}.${n6}${n7}${n8}/${n9}${n10}${n11}${n12}-${d1}${d2}`;
}

function generateNFeKey() {
    let key = '';
    for (let i = 0; i < 43; i++) {
        key += random(9);
    }

    let sum = 0;
    let weight = 2;
    for (let i = 42; i >= 0; i--) {
        sum += parseInt(key[i]) * weight;
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