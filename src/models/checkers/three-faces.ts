// Start converting functions from
// three/exemples/jsm/math/ConvexHull
// but not necessary anymore
import { Triangle, Vector3 } from "three";

const Visible = 0;
const Deleted = 1;

export class Face {
  public normal = new Vector3();
  public midpoint = new Vector3();
  public area = 0;

  public constant = 0; // signed distance from face to the origin
  public outside = null; // reference to a vertex in a vertex list this face can see
  public mark = Visible;
  public edge: HalfEdge | null = null;

  public static create(a: VertexNode, b: VertexNode, c: VertexNode) {
    // todo: any ===>> VertexNode

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

  public getEdge(i: number) {
    var edge = this.edge;

    while (i > 0) {
      edge = (edge as HalfEdge).next;
      i--;
    }

    while (i < 0) {
      edge = (edge as HalfEdge).prev;
      i++;
    }

    return edge;
  }

  public compute() {
    var triangle: Triangle | undefined;

    return (function compute(this: any) {
      if (triangle === undefined) triangle = new Triangle();

      var a = this.edge.tail();
      var b = this.edge.head();
      var c = this.edge.next.head();

      triangle.set(a.point, b.point, c.point);

      triangle.getNormal(this.normal);
      triangle.getMidpoint(this.midpoint);
      this.area = triangle.getArea();

      this.constant = this.normal.dot(this.midpoint);

      return this;
    })();
  }

  public distanceToPoint(point: any) {
    return this.normal.dot(point) - this.constant;
  }
}

export class HalfEdge {
  public vertex: any; // VertexNode
  public prev: HalfEdge | null = null;
  public next: HalfEdge | null = null;
  public twin: HalfEdge | null = null;
  public face: Face;

  constructor(vertex: any, face: Face) {
    this.vertex = vertex;
    this.face = face;
  }

  public head() {
    return this.vertex;
  }

  public tail() {
    return this.prev ? this.prev.vertex : null;
  }

  public length() {
    var head = this.head();
    var tail = this.tail();

    if (tail !== null) {
      return tail.point.distanceTo(head.point);
    }

    return -1;
  }

  public lengthSquared() {
    var head = this.head();
    var tail = this.tail();

    if (tail !== null) {
      return tail.point.distanceToSquared(head.point);
    }

    return -1;
  }

  // public setTwin ( edge: { twin: any; } ) {

  //   this.twin = edge;
  //   edge.twin = this;

  //   return this;

  // }
}

export class VertexNode {
  public point: Vector3;
  public prev = null;
  public next = null;
  public face: Face | null = null; // the face that is able to see this vertex

  constructor(point: Vector3) {
    this.point = point;
  }
}
