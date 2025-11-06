1) getPriority declared inside the component

The function is re-created on every render → unnecessary memory allocation.

It does not use a constant map or memoization → inefficient lookup.

✅ Improvement: Move it outside the component or use a constant map + useCallback.

2) Filter logic is incorrect & undeclared variable (lhsPriority)

lhsPriority does not exist → bug.

Filter condition is likely wrong: it only returns true when amount <= 0, whereas it should probably filter amount > 0.

✅ Improvement: Clarify the logic and avoid hard-to-read conditions.

3) .filter().sort() inside useMemo, but still depends on prices

prices does not affect sortedBalances, yet it is in the dependency array → unnecessary recomputation → CPU waste.

✅ Improvement: Only depend on the actual variables that affect computation (balances).

4) Mapping twice to create formattedBalances and rows

Mapping over the same data twice → wasted iterations.

formattedBalances and rows are not memoized.

✅ Improvement: Compute formatted, usdValue, and other derived data in a single map or memoize.

5) key={index}

Using index as key is an anti-pattern → unnecessary re-renders on reorder.

✅ Improvement: Use a unique identifier such as balance.currency or an id.

6) Repeated calls to getPriority

getPriority is called in filter and again in sort → duplicate computation.

✅ Improvement: Cache priority values during computation.

7) TypeScript type mismatch in map

sortedBalances.map((balance: FormattedWalletBalance) but sortedBalances actually contains WalletBalance.

✅ Fix: Ensure the mapping type is correct or transform balances to FormattedWalletBalance first.