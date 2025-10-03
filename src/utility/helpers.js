export function parseNumber(input, defaultValue = 1,min = 1,max = 500) {
    if (typeof input === "string") {
        input = parseFloat(input);
    }
    if (!(typeof input === "number")) return defaultValue;
    if (input < min) return min;
    if (input > max) return max;
    return input;
}

export function toFileName(name) {
    if(name)  return name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
}