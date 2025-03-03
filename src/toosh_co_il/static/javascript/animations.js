function getRandomIntInclusive(min, max) {
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
}

function createCharSpan(char, bold) {
  const elem = document.createElement("span");
  elem.classList.add("text-transparent");
  elem.dataset.bold = bold;
  elem.textContent = char;
  return elem;
}

function wrapCharactersWithSpans(pTag) {
  for (bTag of pTag.querySelectorAll("b")) {
    for (char of bTag.textContent) {
      pTag.insertBefore(createCharSpan(char, true), bTag);
    }
    bTag.remove();
  }
  const childNodes = Array.from(pTag.childNodes);
  childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      for (char of node.textContent) {
        pTag.insertBefore(createCharSpan(char, false), node);
      }
      node.remove();
    }
  });
}

function typewriter(elem, interval, flux = 0, blinkingCursor = true) {
  return new Promise((resolve) => {
    const originalInterval = interval;
    const children = Array.from(elem.childNodes);
    let index = 0;
    var lastUpdateTimestamp;
    function step(timestamp) {
      if (index >= children.length) {
        resolve();
        return;
      }

      const fluctuation = getRandomIntInclusive(0, flux);
      interval += fluctuation;

      var charsToReveal;
      if (!lastUpdateTimestamp) {
        charsToReveal = 1;
      } else {
        const elapsedTime = Math.floor(timestamp - lastUpdateTimestamp);
        charsToReveal = Math.floor(elapsedTime / interval); // num of chars to untransparent this frame
      }

      if (charsToReveal > 0) {
        lastUpdateTimestamp = timestamp;
      }

      while (charsToReveal > 0 && index < children.length) {
        children[index].classList.remove("text-transparent");
        if (blinkingCursor) {
          children[index].classList.add("blinking-cursor");
          if (index > 0) {
            children[index - 1].classList.remove("blinking-cursor");
          }
        }
        charsToReveal--;
        index++;
      }
      interval = originalInterval;
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  });
}

function untypewriter(elem, interval, flux = 0) {
  return new Promise((resolve) => {
    const originalInterval = interval;
    const children = Array.from(elem.childNodes);
    children.reverse();
    let index = 0;
    var lastUpdateTimestamp;
    function step(timestamp) {
      if (index >= children.length) {
        resolve();
        return;
      }

      const fluctuation = getRandomIntInclusive(0, flux);
      interval += fluctuation;

      var charsToReveal;
      if (!lastUpdateTimestamp) {
        charsToReveal = 1;
      } else {
        const elapsedTime = Math.floor(timestamp - lastUpdateTimestamp);
        charsToReveal = Math.floor(elapsedTime / interval); // num of chars to untransparent this frame
      }

      if (charsToReveal > 0) {
        lastUpdateTimestamp = timestamp;
      }

      while (charsToReveal > 0 && index < children.length) {
        children[index].classList.add("text-transparent");
        charsToReveal--;
        index++;
      }
      interval = originalInterval;
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  });
}

function underliner(elem, interval, flux = 0) {
  return new Promise((resolve) => {
    const originalInterval = interval;
    const children = Array.from(elem.childNodes);
    let index = 0;
    var lastUpdateTimestamp;
    function step(timestamp) {
      if (index >= children.length) {
        resolve();
        return;
      }

      const fluctuation = getRandomIntInclusive(0, flux);
      interval += fluctuation;

      var charsToReveal;
      if (!lastUpdateTimestamp) {
        charsToReveal = 1;
      } else {
        const elapsedTime = Math.floor(timestamp - lastUpdateTimestamp);
        charsToReveal = Math.floor(elapsedTime / interval); // num of chars to untransparent this frame
      }

      if (charsToReveal > 0) {
        lastUpdateTimestamp = timestamp;
      }

      while (charsToReveal > 0 && index < children.length) {
        children[index].classList.add("underline");
        children[index].classList.add("decoration-black");
        charsToReveal--;
        index++;
      }
      interval = originalInterval;
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  });
}

function bolden(elem, interval, flux = 0) {
  return new Promise((resolve) => {
    const originalInterval = interval;
    const children = Array.from(elem.childNodes);
    let index = 0;
    var lastUpdateTimestamp;
    function step(timestamp) {
      if (index >= children.length) {
        resolve();
        return;
      }

      const fluctuation = getRandomIntInclusive(0, flux);
      interval += fluctuation;

      var charsToBolden;
      if (!lastUpdateTimestamp) {
        charsToBolden = 1;
      } else {
        const elapsedTime = Math.floor(timestamp - lastUpdateTimestamp);
        charsToBolden = Math.floor(elapsedTime / interval); // num of chars to untransparent this frame
      }

      if (charsToBolden > 0) {
        lastUpdateTimestamp = timestamp;
      }

      while (charsToBolden > 0 && index < children.length) {
        if (children[index].dataset.bold != "true") {
          index++;
          continue;
        }
        children[index].classList.add("font-bold");
        charsToBolden--;
        index++;
      }
      interval = originalInterval;
      requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  });
}
