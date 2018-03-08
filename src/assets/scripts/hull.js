import * as d3 from 'd3';

export default class Hull {
  constructor(id, points, radius=25, padding=10) {
    this.id = id;
    this.points = points;
    this.radius = radius;
    this.padding = padding;

    this.line = d3.line()
      .curve(d3.curveCatmullRomClosed)
      .x((d) => d.p[0])
      .y((d) => d.p[1]);
    
    this.convexHull = this.points.length < 3 ? this.points : d3.polygonHull(this.points);
    this.d = this.smoothHull(this.convexHull);
  }

  vecFrom(p0, p1) {               // Vector from p0 to p1
    return [p1[0] - p0[0], p1[1] - p0[1]]
  }

  vecScale(v, scale) {            // Vector v scaled by 'scale'
    return [scale * v[0], scale * v[1]];
  }

  vecSum(pv1, pv2) {              // The sum of two points/vectors
    return [pv1[0] + pv2[0], pv1[1] + pv2[1]];
  }

  vecUnit(v) {                    // Vector with direction of v and length 1
    const norm = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
    return this.vecScale(v, 1 / norm);
  }

  vecScaleTo(v, length) {         // Vector with direction of v with specified length
    return this.vecScale(this.vecUnit(v), length);
  }

  unitNormal(pv0, p1) {           // Unit normal to vector pv0, or line segment from p0 to p1
    if (p1) { pv0 = this.vecFrom(pv0, p1); }
    const normalVec = [-pv0[1], pv0[0]];
    return this.vecUnit(normalVec);
  }


  // Hull Generators
  smoothHull(polyPoints) {
    // Returns the SVG path data string representing the polygon, expanded and smoothed.

    // Handle special cases
    if (!polyPoints || polyPoints.length < 1) { return ''; }
    if (polyPoints.length === 1) { return this.smoothHullSingle(); }
    if (polyPoints.length === 2) { return this.smoothHullDouble(); }

    const hullPoints = polyPoints.map((point, i) => ({
      p: point,
      v: this.vecUnit(this.vecFrom(point, polyPoints[(i + 1) % polyPoints.length])),
    }));

    // Compute the expanded hull points, and the nearest prior control point for each.
    let i = 0;
    while (i < hullPoints.length) {
      // Use a while loop to easily remove hullpoints that have identical vectors
      const next = (i < hullPoints.length - 1) ? (i + 1) : 0;
      if (JSON.stringify(hullPoints[i].v) === JSON.stringify(hullPoints[next].v)) {
        hullPoints.splice(i, 1);
        continue;
      }
      const prior = (i > 0) ? (i - 1) : (hullPoints.length - 1);
      let extensionVec = this.vecUnit(this.vecSum(hullPoints[prior].v, this.vecScale(hullPoints[i].v, -1)));
      hullPoints[i].p = this.vecSum(hullPoints[i].p, this.vecScale(extensionVec, this.padding));
      i++;
    }

    return this.line(hullPoints);
  }


  smoothHullSingle() {
    // Returns the path for a circular hull around a single point.

    let p1 = [this.points[0][0], this.points[0][1] - this.padding];
    let p2 = [this.points[0][0], this.points[0][1] + this.padding];

    return 'M ' + p1
      + ' A ' + [this.padding, this.padding, '0,0,0', p2].join(',')
      + ' A ' + [this.padding, this.padding, '0,0,0', p1].join(',');
  }


  smoothHullDouble() {
    // Returns the path for a rounded hull around two points.
    let v = this.vecFrom(this.points[0], this.points[1]);
    let extensionVec = this.vecScaleTo(v, this.padding);

    let extension0 = this.vecSum(this.points[0], this.vecScale(extensionVec, -1));
    let extension1 = this.vecSum(this.points[1], extensionVec);

    let tangentHalfLength = 1.2 * this.padding;
    let controlDelta = this.vecScaleTo(this.unitNormal(v), tangentHalfLength);
    let invControlDelta = this.vecScale(controlDelta, -1);

    let control0 = this.vecSum(extension0, invControlDelta);
    let control1 = this.vecSum(extension1, invControlDelta);
    let control3 = this.vecSum(extension0, controlDelta);

    return 'M ' + extension0
      + ' C ' + [control0, control1, extension1].join(',')
      + ' S ' + [control3, extension0].join(',')
      + ' Z';
  }
}
