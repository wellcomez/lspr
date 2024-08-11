class node {
    constructor(name, dir) {
        this.name = name;
        this.dir = dir;
    }
}
function ss(name, dir) {
    return new node(name, dir)
}
var sss = [ss("a", false), ss("b", true), ss("b", true), ss("c", false), ss("")]
var yyy = sss.sort(function (a, b) {
    if (a.dir && a.dir == b.dir)
        return a.name.localeCompare(b.name);
    if (a.dir) {
        return -1;
    }
    if (b.dir) {
        return 1;
    }
    return a.name.localeCompare(b.name);
})
console.log(yyy)