import { useState, useRef, useEffect, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const TOKEN_ICON_BASE =
  "https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/";

interface Props {
  tokens: string[];
  selected: string;
  onChange: (token: string) => void;
  disabledTokens?: string[];
}

function TokenSelectorComponent({
  tokens,
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-40" ref={ref}>
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
              ((e.target as HTMLImageElement).src = TOKEN_ICON_BASE + "SWTH.svg")
            }
            className="w-5 h-5 rounded-full"
          />
          <span className="text-sm font-medium">{selected}</span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 mt-2 w-full bg-gray-800 border border-gray-700 rounded-xl shadow-xl max-h-64 overflow-y-auto"
          >
            {tokens.map((token) => {
              const isDisabled = disabledTokens.includes(token);
              return (
                <li
                  key={token}
                  onClick={() => handleSelect(token)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm cursor-pointer ${
                    isDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-700"
                  }`}
                  title={isDisabled ? "Cannot select the same token" : ""}
                >
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
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(TokenSelectorComponent);
