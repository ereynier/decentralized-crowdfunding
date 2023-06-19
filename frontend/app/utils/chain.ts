import { sepolia, foundry, Chain } from "wagmi/chains";

const CHAIN = process.env.CHAIN || "foundry";

const chains: {[key: string]: Chain} = {
    sepolia,
    foundry,
};

export const chain: Chain = chains[CHAIN];