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
      }
    }
  }
}
