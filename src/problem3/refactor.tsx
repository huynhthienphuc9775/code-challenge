interface WalletBalance {
  currency: string;
  blockchain: string;
  amount: number;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

const PRIORITY_MAP: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

const getPriority = (chain: string) => PRIORITY_MAP[chain] ?? -99;

const WalletPage: React.FC<Props> = (props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances = useMemo<FormattedWalletBalance[]>(() => {
    return balances
      .filter(b => getPriority(b.blockchain) > -99 && b.amount > 0)
      .map(b => ({
        ...b,
        formatted: b.amount.toFixed(),
        usdValue: (prices[b.currency] ?? 0) * b.amount,
        priority: getPriority(b.blockchain),
      }))
      .sort((a, b) => b.priority - a.priority);
  }, [balances, prices]);

  return (
    <div {...rest}>
      {formattedBalances.map((b) => (
        <WalletRow
          key={b.currency}
          amount={b.amount}
          usdValue={b.usdValue}
          formattedAmount={b.formatted}
        />
      ))}
    </div>
  );
};
