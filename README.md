# get-arc56-error

To install dependencies:

```bash
npx bun install
```

To run:

```bash
npx bun src/index.ts
```

To avoid using npx, install bun globally: `npm i -g bun`

This project was created using `bun init` in bun v1.2.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Example

### Find source info from app and PC

```
bun src/index.ts find ~/git/other/reti/contracts/contracts/artifacts/ValidatorRegistry.arc56.json --app 730776936 --pc 3650 --network testnet
```

### Parse error

```
bun src/index.ts parse ~/git/other/reti/contracts/contracts/artifacts/StakingPool.arc56.json "TransactionPool.Remember: transaction I52GYOJNDEQEZVE3W66YHPBAWTRXEYVKEJOTMYREHBJX5QKYSTEA: l
ogic eval error: assert failed pc=3650. Details: app=730776936, pc=3650" --network testnet
```
