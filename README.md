# emitter

A tiny typed-friendly event emitter with once, off and unsubscribe functions.

## Usage

```js
import { Emitter } from "emitter";

const bus = new Emitter();
const off = bus.on("ready", (value) => console.log(value));
bus.emit("ready", 42);
off();
```

## Test

```bash
npm test
```

## License

MIT
