export function parseNumber(input) {
    let steps = 1;
    if (typeof input === "number") steps = input;
    return steps;
}

export function toFileName(name) {
    if(name)  return name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
}