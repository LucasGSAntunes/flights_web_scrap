// __tests__/parsers/FlightTextParser.test.ts
import { FlightTextParser } from '../../../domain/helpers/FlightTextParser';
import { ParsedFlight } from '../../../domain/entities/ParsedFlight';

describe('FlightTextParser.parse', () => {
  it('→ retorna campos vazios se o texto tiver menos de 7 linhas', () => {
    const shortText = 'Linha 1\nLinha 2\nLinha 3\nLinha 4\nLinha 5\nLinha 6';
    const result = FlightTextParser.parse(shortText);

    expect(result).toEqual<ParsedFlight>({
      from: '',
      to: '',
      departureTime: '',
      arrivalTime: '',
      duration: '',
      aircraft: '',
      prices: {
        economy: '',
        business: '',
      },
    });
  });

  it('→ extrai corretamente todos os campos em um texto bem formado', () => {
    const sampleText = `
08:00
Informações adicionais
NYC → LON
Outra linha
20:00
Linha qualquer
LON
Aircraft type: Boeing 777
Total travel duration 12h 30m
Detalhes de preços:
 - ECONOMY assento simples BRL 500.50
 - BUSINESS conforto premium BRL 1,500
`.trim();

    const result = FlightTextParser.parse(sampleText);

    expect(result.departureTime).toBe('08:00');
    expect(result.arrivalTime).toBe('20:00');
    expect(result.from).toBe('NYC → LON');
    expect(result.to).toBe('LON');
    expect(result.aircraft).toBe('Boeing 777');
    expect(result.duration).toBe('12h 30m');
    expect(result.prices).toEqual({ economy: '500.50', business: '1,500' });
  });

  it('→ retorna string vazia para campos faltantes (regex não bate)', () => {
    const textMissing = `
06:15
Info
ABC → XYZ
Info
18:45
Info
XYZ
Sem menção de Aircraft nem Duration nem preços
`.trim();

    const result = FlightTextParser.parse(textMissing);
    expect(result.aircraft).toBe('');
    expect(result.duration).toBe('');
    expect(result.prices).toEqual({ economy: '', business: '' });
  });

  it('→ lida com formatação de preços com ponto e vírgula misturados', () => {
    const textPrices = `
00:00
Info
ORIG → DEST
Info
23:59
Info
DEST
Aircraft type: Airbus A320
Total travel duration 2h 5m
Promoções:
ECONOMY pacote básico BRL 2.345,67 algumas infos
BUSINESS pacote VIP BRL 3.456.78 infos adicionais
`.trim();

    const result = FlightTextParser.parse(textPrices);
    expect(result.prices.economy).toBe('2.345,67');
    expect(result.prices.business).toBe('3.456.78');
  });
});
