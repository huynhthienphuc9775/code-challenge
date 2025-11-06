import { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const TOKEN_ICON_BASE =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

interface Price {
  currency: string;
  price: number;
}

interface Props {
  tokens: string[];
  prices: Price[];
  selected: string;
  onChange: (token: string) => void;
  disabledTokens?: string[];
}

function TokenSelectorComponent({
  tokens,
  prices,
  selected,
  onChange,
  disabledTokens = [],
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback(
    (token: string) => {
      if (!disabledTokens.includes(token)) {
        onChange(token);
        setOpen(false);
      }
    },
    [onChange, disabledTokens]
  );

  const getIcon = useCallback(
    (token: string) => `${TOKEN_ICON_BASE}${token}.svg`,
    []
  );

  const getPrice = useCallback(
    (token: string) => prices.find((p) => p.currency === token)?.price ?? 0,
    [prices]
  );

  const formatPrice = (price: number) =>
    price ? `$${price.toFixed(2)}` : "--";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedPrice = getPrice(selected);

  return (
    <div className="relative w-44" ref={ref}>
      {/* Selected Token Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center justify-between w-full bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-xl border border-gray-700 transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <img
            src={getIcon(selected)}
            alt={selected}
            onError={(e) =>
              ((e.target as HTMLImageElement).src =
                TOKEN_ICON_BASE + "SWTH.svg")
            }
            className="w-5 h-5 rounded-full"
          />
          <div className="flex flex-row text-left items-center gap-2">
            <span className="text-sm font-medium">{selected}</span>
            <span className="text-xs text-gray-400">
              {formatPrice(selectedPrice)}
            </span>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-2 w-full rounded-xl border border-gray-700 shadow-xl overflow-hidden bg-gray-800"
          >
            <ul className="max-h-64 overflow-y-auto token-options">
              {tokens.map((token) => {
                const price = getPrice(token);
                const isDisabled = disabledTokens.includes(token);

                return (
                  <li
                    key={token}
                    onClick={() => handleSelect(token)}
                    className={`flex items-center justify-between px-3 py-2 text-sm cursor-pointer ${
                      isDisabled
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-gray-700"
                    }`}
                    title={isDisabled ? "Cannot select the same token" : ""}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={getIcon(token)}
                        alt={token}
                        onError={(e) =>
                          ((e.target as HTMLImageElement).src =
                            TOKEN_ICON_BASE + "SWTH.svg")
                        }
                        className="w-5 h-5 rounded-full"
                      />
                      <span className="text-white">{token}</span>
                    </div>
                    <span className="text-gray-400 text-xs">
                      {formatPrice(price)}
                    </span>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(TokenSelectorComponent);
