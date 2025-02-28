import { AppClient } from "@algorandfoundation/algokit-utils/types/app-client";
import { AlgorandClient } from "@algorandfoundation/algokit-utils";
import type { LogicError } from "@algorandfoundation/algokit-utils/types/logic-error";
import { docopt } from "docopt";
import { readFileSync } from "fs";

const doc = `get-arc56-error

Usage:
  get-arc56-error parse [options] <arc56-path> <error> 

Options:
  --network=<testnet|mainnet|localnet> The network the deployed app is on
`;

const parsedArgs = docopt(doc);

const arc56 = JSON.parse(readFileSync(parsedArgs["<arc56-path>"], "utf-8"));
const errorMessage = parsedArgs["<error>"];
const network = parsedArgs["--network"];

const app = BigInt(errorMessage.match(/app=(\d+)/)![1]);

let algorand: AlgorandClient;

if (network === "testnet") {
  algorand = AlgorandClient.testNet();
} else if (network === "mainnet") {
  algorand = AlgorandClient.mainNet();
} else if (network === "localnet") {
  algorand = AlgorandClient.defaultLocalNet();
} else {
  throw new Error(`Unknown network: ${network}`);
}

console.log(
  `Getting approval program for ${arc56.name} (${app}) on testnet...`,
);
const program = (await algorand.client.algod.getApplicationByID(app).do())
  .params.approvalProgram;

const error = new Error(errorMessage);
console.log(`Parsing error: ${error.message}...`);
const logicError = AppClient.exposeLogicError(
  error,
  // @ts-ignore
  arc56,
  { program, approvalSourceInfo: arc56.sourceInfo.approval },
) as LogicError;
console.debug({ teal: logicError.teal_line, details: logicError.led });
