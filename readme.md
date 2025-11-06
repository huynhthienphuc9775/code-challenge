# Fancy Token Swap Form

A simple and elegant token swap form built with **React**, **TypeScript**, and **Tailwind CSS**.  
Users can select tokens, input amounts, and see real-time conversion based on live token prices.

---

## 🌟 Features

- Swap between different tokens with live price calculation.
- Automatically calculates "to" amount when user types "from" amount (and vice versa).
- Prevents invalid input (only numbers and decimals allowed).
- Swap button to quickly switch "from" and "to" tokens.
- Loading state when fetching token prices.

---

## 🛠 Tech Stack

- **React 18** + **TypeScript**
- **Tailwind CSS** for styling
- **Lucide Icons** for UI icons
- Custom hooks: `useFetchPrices`
- Utility functions: `formatNumber`, `parseNumber`

---

## 🚀 Installation

1. Clone the repository:

```bash
git clone https://github.com/huynhthienphuc9775/code-challenge
cd src
cd problem2
```

2. Install dependencies:
```bash
npm install
```

3. Run the project:
```bash
npm run dev
```
Open http://localhost:5173 in your browser.