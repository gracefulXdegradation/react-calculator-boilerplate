export const getDecimalPoints = num => (`${num}`.split('.')[1] || '').length;

export const getMaxDecimalPoints = (numA, numB) => Math.max(getDecimalPoints(numA), getDecimalPoints(numB));

export const formatOutput = (num) => {
    const minus = num[0] === '-' ? '-' : '';
    const hasDot = num.includes('.');
    const [int, dec] = num.replace('-', '').split('.');
    const formattedInt = int.split('').reverse().reduce(
        (acc, val, i) => acc + (i > 0 && i % 3 === 0 ? ' ' : '') + val, '',
    ).split('')
        .reverse()
        .join('');
    const output = `${minus}${formattedInt}${hasDot ? `.${dec}` : ''}`;

    return output.length > 13 ? 'TOO LONG' : output;
};
