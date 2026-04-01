import { Text } from 'react-native';
import { groupedQuotes } from '@/src/constants/groupedQuotes';

export function RandomQuote() {
  const mood =
    Object.keys(groupedQuotes)[Math.floor(Math.random() * Object.keys(groupedQuotes).length)];
  const quotes = groupedQuotes[mood];
  const { quote } = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <Text className="max-w-sm text-center font-noto-serif-italic text-3xl leading-tight text-primary md:text-5xl">
      &quot;{quote}&quot;
    </Text>
  );
}
