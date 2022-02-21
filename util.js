
/**
    @param array Array reference
    @returns void

    Shuffles (modifies) given array.
 */
function shuffleArrayRef(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
    @param array Array
    @returns array

    Returns given array shuffled.
 */
function shuffleArray(array) {
    return array
        .map(value => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

function sqr(a) { return a*a; }

// Uses p5.js sin & cos functions. Expects degrees
function rotatePoint(centerX, centerY, pointX, pointY, angle) {
    angle = angle * (Math.PI / 180);
    return {
        x: Math.cos(angle) * (pointX - centerX) - Math.sin(angle) * (pointY - centerY) + centerX,
        y: Math.sin(angle) * (pointX - centerX) + Math.cos(angle) * (pointY - centerY) + centerY,
    };
}

// source: easings.net
function easeInElastic(x) {
    const c4 = (2 * Math.PI) / 3;

    return x === 0
        ? 0
        : x === 1
        ? 1
        : pow(2, -10 * x) * sin((x * 10 - 0.75) * c4) + 1;
}
