"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VertexNode = exports.HalfEdge = exports.Face = void 0;
// Start converting functions from
// three/exemples/jsm/math/ConvexHull
// but not necessary anymore
const three_1 = require("three");
const Visible = 0;
const Deleted = 1;
class Face {
    constructor() {
        this.normal = new three_1.Vector3();
        this.midpoint = new three_1.Vector3();
        this.area = 0;
        this.constant = 0; // signed distance from face to the origin
        this.outside = null; // reference to a vertex in a vertex list this face can see
        this.mark = Visible;
        this.edge = null;
    }
    static create(a, b, c) {
        var face = new Face();
        var e0 = new HalfEdge(a, face);
        var e1 = new HalfEdge(b, face);
        var e2 = new HalfEdge(c, face);
        // join edges
        e0.next = e2.prev = e1;
        e1.next = e0.prev = e2;
        e2.next = e1.prev = e0;
        // main half edge reference
        face.edge = e0;
        return face.compute();
    }
    getEdge(i) {
        var edge = this.edge;
        while (i > 0) {
            edge = edge.next;
            i--;
        }
        while (i < 0) {
            edge = edge.prev;
            i++;
        }
        return edge;
    }
    compute() {
        var triangle;
        return function compute() {
            if (triangle === undefined)
                triangle = new three_1.Triangle();
            var a = this.edge.tail();
            var b = this.edge.head();
            var c = this.edge.next.head();
            triangle.set(a.point, b.point, c.point);
            triangle.getNormal(this.normal);
            triangle.getMidpoint(this.midpoint);
            this.area = triangle.getArea();
            this.constant = this.normal.dot(this.midpoint);
            return this;
        }();
    }
    distanceToPoint(point) {
        return this.normal.dot(point) - this.constant;
    }
}
exports.Face = Face;
class HalfEdge {
    constructor(vertex, face) {
        this.prev = null;
        this.next = null;
        this.twin = null;
        this.vertex = vertex;
        this.face = face;
    }
    head() {
        return this.vertex;
    }
    tail() {
        return this.prev ? this.prev.vertex : null;
    }
    ;
    length() {
        var head = this.head();
        var tail = this.tail();
        if (tail !== null) {
            return tail.point.distanceTo(head.point);
        }
        return -1;
    }
    lengthSquared() {
        var head = this.head();
        var tail = this.tail();
        if (tail !== null) {
            return tail.point.distanceToSquared(head.point);
        }
        return -1;
    }
}
exports.HalfEdge = HalfEdge;
class VertexNode {
    constructor(point) {
        this.prev = null;
        this.next = null;
        this.face = null; // the face that is able to see this vertex
        this.point = point;
    }
}
exports.VertexNode = VertexNode;
//# sourceMappingURL=three-faces.js.map