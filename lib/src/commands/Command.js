export { isCommand };
export { isUndoCommand };
function isCommand(obj) {
    return (typeof obj.exec === 'function');
}
function isUndoCommand(obj) {
    return (typeof obj.exec === 'function')
        && (typeof obj.undo === 'function');
}
//# sourceMappingURL=Command.js.map