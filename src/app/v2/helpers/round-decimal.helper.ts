export function decimalPlaceRound(expresion: number, xPlace: number){
    return Number(Math.round(Number(expresion + 'e' + xPlace)) + 'e-' + xPlace);
}

export function decimalRoundToNearest5(value){
    return Math.round(value * 2) / 2;
}