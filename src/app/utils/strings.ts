const numberWords: { [key: string]: number } = {
  cero: 0,
  uno: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  siete: 7,
  ocho: 8,
  nueve: 9,
  diez: 10,
  once: 11,
  doce: 12,
  trece: 13,
  catorce: 14,
  quince: 15,
  dieciséis: 16,
  diecisiete: 17,
  dieciocho: 18,
  diecinueve: 19,
  veinte: 20,
  veintiuno: 21,
  veintidós: 22,
  veintitrés: 23,
  veinticuatro: 24,
  veinticinco: 25,
  veintiséis: 26,
  veintisiete: 27,
  veintiocho: 28,
  veintinueve: 29,
  treinta: 30,
  cuarenta: 40,
  cincuenta: 50,
  sesenta: 60,
  setenta: 70,
  ochenta: 80,
  noventa: 90,
  ciento: 100,
  doscientos: 200,
  trescientos: 300,
  cuatrocientos: 400,
  quinientos: 500,
  seiscientos: 600,
  setecientos: 700,
  ochocientos: 800,
  novecientos: 900,
  mil: 1000,
};

export function convertWordsToNumber(input: string) {
  if (typeof input !== 'string' || !isValidSpanishNumber(input)) {
    return input;
  }

  function parseNumberPart(words: string[]) {
    let result = 0;
    words.forEach((word, index) => {
      if (numberWords[word] !== undefined) {
        result += numberWords[word];
      } else if (word === 'y') {
        return;
      } else if (word.includes('veinti')) {
        result += numberWords[word];
      }
    });
    return result;
  }

  const [integerPart, fractionalPart] = input
    .replace(/\./g, ' punto')
    .split('punto')
    .map((part) => part.trim());

  const integerWords = integerPart.split(/\s+/);
  const integerNumber = parseNumberPart(integerWords);

  const fractionalWords = fractionalPart ? fractionalPart.split(/\s+/) : [];
  const fractionalNumber = parseNumberPart(fractionalWords);

  const fractionalStr = fractionalNumber.toString().padStart(2, '0');
  return `${integerNumber}.${fractionalStr}`;
}

function isValidSpanishNumber(value: string) {
  const regex = /^[+-]?(\d+(\.\d+)?|\.\d+)$/;
  return !regex.test(value);
}
