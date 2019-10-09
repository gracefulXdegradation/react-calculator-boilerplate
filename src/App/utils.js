export const getDecimalPoints = num => (`${num}`.split('.')[1] || '').length;

export const getMaxDecimalPoints = (numA, numB) => Math.max(getDecimalPoints(numA), getDecimalPoints(numB));

export const formatNumber = (num) => {
    const hasDot = num.includes('.');
    const [int, dec] = num.split('.');
    const formattedInt = int.split('').reverse().reduce(
        (acc, val, i) => acc + (i > 0 && i % 3 === 0 ? ' ' : '') + val, '',
    ).split('')
        .reverse()
        .join('');

    return formattedInt + (hasDot ? `.${dec}` : '');
};
