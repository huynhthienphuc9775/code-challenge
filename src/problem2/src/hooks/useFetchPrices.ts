// hooks/useFetchPrices.ts
import { useEffect, useState } from "react";

export interface TokenPrice {
  currency: string;
  date: string;
  price: number;
}

export function useFetchPrices() {
  const [prices, setPrices] = useState<TokenPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch("https://interview.switcheo.com/prices.json");
        const data: TokenPrice[] = await res.json();
        setPrices(data);
      } catch (err) {
        console.error("Error fetching prices:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  return { prices, loading };
}
