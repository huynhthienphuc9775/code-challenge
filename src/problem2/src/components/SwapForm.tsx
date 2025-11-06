// components/SwapForm.tsx
import { useState, useMemo, useCallback } from "react";
import TokenSelector from "./TokenSelector";
import { ArrowDownUp, Loader2 } from "lucide-react";
import { useFetchPrices } from "../hooks/useFetchPrices";
import { formatNumber, parseNumber } from "../utils";

export default function SwapForm() {
  const { prices, loading } = useFetchPrices();
  const tokens = useMemo(() => Array.from(new Set(prices.map((p) => p.currency))), [prices]);

  const [fromToken, setFromToken] = useState("ATOM");
  const [toToken, setToToken] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [swapping, setSwapping] = useState(false);

  const getPrice = useCallback(
    (token: string) => prices.find((p) => p.currency === token)?.price ?? 0,
    [prices]
  );

  const calculateAmount = useCallback(
    (value: string, from: string, to: string) => {
      const amount = parseNumber(value);
      const fromPrice = getPrice(from);
      const toPrice = getPrice(to);
      if (!fromPrice || !toPrice || !value) return "";
      return formatNumber((amount * fromPrice) / toPrice);
    },
    [getPrice]
  );

  const handleFromChange = useCallback(
    (value: string) => {
      const sanitized = value.replace(/[^0-9.]/g, "");
      setFromAmount(sanitized);
      setToAmount(calculateAmount(sanitized, fromToken, toToken));
    },
    [fromToken, toToken, calculateAmount]
  );

  const handleToChange = useCallback(
    (value: string) => {
      const sanitized = value.replace(/[^0-9.]/g, "");
      setToAmount(sanitized);
      setFromAmount(calculateAmount(sanitized, toToken, fromToken));
    },
    [fromToken, toToken, calculateAmount]
  );

  const handleSwapTokens = useCallback(() => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  }, [fromToken, toToken, fromAmount, toAmount]);

  const handleExecuteSwap = useCallback(() => {
    const from = parseNumber(fromAmount);
    const to = parseNumber(toAmount);
    if (from <= 0 || to <= 0) return;

    setSwapping(true);
    setTimeout(() => {
      setSwapping(false);
      alert(
        `Swap successful: ${formatNumber(from)} ${fromToken} → ${formatNumber(
          to
        )} ${toToken}`
      );
      setFromAmount("");
      setToAmount("");
    }, 1000);
  }, [fromAmount, toAmount, fromToken, toToken]);

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-gray-800">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
        <span className="ml-3 text-gray-300">Đang tải dữ liệu token...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-gray-800 px-4">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
        <h2 className="text-2xl font-semibold text-white mb-6 text-center">
          Currency Swap
        </h2>

        <div className="flex flex-col gap-4 mb-4">
          {/* From */}
          <div className="flex items-center gap-3">
            <TokenSelector
              tokens={tokens}
              selected={fromToken}
              onChange={setFromToken}
              disabledTokens={[toToken]}
            />
            <input
              type="text"
              placeholder="0.0"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              value={fromAmount}
              onChange={(e) => handleFromChange(e.target.value)}
            />
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwapTokens}
              className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 text-white rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
            >
              <ArrowDownUp className="w-6 h-6" />
            </button>
          </div>

          {/* To */}
          <div className="flex items-center gap-3">
            <TokenSelector
              tokens={tokens}
              selected={toToken}
              onChange={setToToken}
              disabledTokens={[fromToken]}
            />
            <input
              type="text"
              placeholder="0.0"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              value={toAmount}
              onChange={(e) => handleToChange(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleExecuteSwap}
          disabled={
            swapping ||
            parseNumber(fromAmount) <= 0 ||
            parseNumber(toAmount) <= 0
          }
          className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition-all duration-200 flex justify-center items-center disabled:opacity-50"
        >
          {swapping ? <Loader2 className="w-5 h-5 animate-spin" /> : "Swap"}
        </button>
      </div>
    </div>
  );
}
