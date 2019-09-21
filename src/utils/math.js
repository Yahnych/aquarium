const random = (min, max) => Math.floor(Math.random() * max) + min;
const randomFloat = (min, max) => Math.random() * max + min;
const randomFloatWithNegativeRange = (range) => (Math.floor(Math.random()*2) ? 1 : -1) * randomFloat(0, range);
const calculateDistance = (a, b) => int(dist(a.x, a.y, b.x, b.y));
const vectorMagnitude = (x, y) => Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
const angleToPoint = (x1, y1, x2, y2) => {
    const d = dist(x1, y1, x2, y2);
    const dx = (x2-x1) / d;
    const dy = (y2-y1) / d;

    let a = Math.acos(dx);
    a = dy < 0 ? 2 * Math.PI - a : a;
    return a;
};
const randPositionInCircle = (originX, originY, size) => {
    const a = Math.random() * 2 * Math.PI;
    const r = size * Math.sqrt(Math.random());
    return {
        x: originX + (r * Math.cos(a)),
        y: originY + (r * Math.sin(a))
    }
};



