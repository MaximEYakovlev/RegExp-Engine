const parse = require("./parser.js");

const stateMatchesStringAtIndex = (state, str, i) => {
  if (i >= str.length) {
    return [false, 0];
  }
  if (state.type === "wildcard") {
    return [true, 1];
  }
  if (state.type === "element") {
    const match = state.value === str[i];
    return [match, match ? 1 : 0];
  }
  if (state.type === "groupElement") {
    return test(state.states, str.slice(i));
  }
  throw new Error("Unsupported element type");
};

function test(states, str) {
  const queue = states.slice();
  let i = 0;
  let currentState = queue.shift();

  while (currentState) {
    switch (currentState.quantifier) {
      case "exactlyOne": {
        [isMatch, consumed] = stateMatchesStringAtIndex(currentState, str, i);

        if (!isMatch) {
          return [false, i];
        }
        i += consumed;
        currentState = queue.shift();
        continue;
      }
      case "zeroOrOne": {
        if (i >= str.length) {
          currentState = queue.shift();
          continue;
        }
        const [isMatch, consumed] = stateMatchesStringAtIndex(
          currentState,
          str,
          i
        );
        i += consumed;
        currentState = queue.shift();
        continue;
      }
      case "zeroOrMore": {
        while (true) {
          if (i >= str.length) {
            currentState = queue.shift();
            break;
          }
          const [isMatch, consumed] = stateMatchesStringAtIndex(
            currentState,
            str,
            i
          );
          if (!isMatch || consumed === 0) {
            currentState = queue.shift();
            break;
          }
          i += consumed;
        }
        continue;
      }
      default: {
        throw new Error("Unsupported operation");
      }
    }
  }
  return [true, i];
}

const regex = "a(b.)*cd";
const states = parse(regex);
const exampleStr = "ab!b$cd";
const result = test(states, exampleStr);
console.log(result);
