import { AppClient } from "@algorandfoundation/algokit-utils/types/app-client";
import { AlgorandClient } from "@algorandfoundation/algokit-utils";
import type { LogicError } from "@algorandfoundation/algokit-utils/types/logic-error";
import { docopt } from "docopt";
import { readFileSync } from "fs";

const doc = `get-arc56-error

Usage:
  get-arc56-error parse [options] <arc56-path> <error>
  get-arc56-error find [options] <arc56-path> --pc=pc --app=app

Options:
  --network=<testnet|mainnet|localnet> The network the deployed app is on
`;

const parsedArgs = docopt(doc);

let errorMessage: string;
let app: bigint;

if (parsedArgs.parse) {
  errorMessage = parsedArgs["<error>"];
  app = BigInt(errorMessage.match(/app=(\d+)/)![1]);
} else {
  const pc = parsedArgs["--pc"];
  app = BigInt(parsedArgs["--app"]);

  // The mechanism for shifting PC is only within parseLogicError, so we need to make a fake error message that this function can parse
  // In the future, the PC mechanism should be publicly exposed for easier use
  errorMessage = `TransactionPool.Remember: transaction I52GYOJNDEQEZVE3W66YHPBAWTRXEYVKEJOTMYREHBJX5QKYSTEA: logic eval error: assert failed pc=${pc}. Details: app=${app}, pc=${pc}`;
}

const arc56 = JSON.parse(readFileSync(parsedArgs["<arc56-path>"], "utf-8"));
const network = parsedArgs["--network"];

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
const logicError = AppClient.exposeLogicError(
  error,
  // @ts-ignore
  arc56,
  { program, approvalSourceInfo: arc56.sourceInfo.approval },
) as LogicError;

const sourceInfo = arc56.sourceInfo.approval.sourceInfo.find(
  (s) => s.teal == logicError.teal_line,
);

console.log("Source Info:", sourceInfo);
