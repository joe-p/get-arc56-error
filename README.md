# get-arc56-error

To install dependencies:

```bash
bun install
```

To run:

```bash
bun src/index.ts
```

This project was created using `bun init` in bun v1.2.4. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Example

```
bun src/index.ts parse ~/git/other/reti/contracts/contracts/artifacts/StakingPool.arc56.json "TransactionPool.Remember: transaction I52GYOJNDEQEZVE3W66YHPBAWTRXEYVKEJOTMYREHBJX5QKYSTEA: l
ogic eval error: assert failed pc=3650. Details: app=730776936, pc=3650" --network testnet
```

## Planned Features

- [ ] Add support for just giving pc and app ID without the full error message
