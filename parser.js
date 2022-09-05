const last = (stack) => stack[stack.length - 1];

const parse = (re) => {
  const stack = [[]];
  let i = 0;

  while (i < re.length) {
    const next = re[i];

    switch (next) {
      case ".": {
        last(stack).push({
          type: "wildcard",
          quantifier: "exactlyOne",
        });
        i++;
        continue;
      }
      case "?": {
        const lastElement = last(last(stack));
        if (!lastElement || lastElement.quantifier !== "exactlyOne") {
          throw new Error(
            "Quantifier must follow an unquantified element or group"
          );
        }
        lastElement.quantifier = "zeroOrOne";
        i++;
        continue;
      }
    }
  }
};
