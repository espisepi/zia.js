/*!
 * Original code from three.js project. https://github.com/mrdoob/three.js
 * Original code published with the following license:
 *
 * The MIT License
 * 
 * Copyright &copy; 2010-2014 three.js authors
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

/**
 * Constructs a new 3x3 matrix. Parameters are supplied in row-major order
 * to aid readability. If called with no parameters, all matrix elements are
 * initialised to 0. If called with any parameters, make sure you supply
 * all 9 values.
 * 
 * @constructor
 *
 * @summary Constructs a new 4x4 matrix.
 *
 * @param {Number} [m11=0.0] - The value for row 0, column 0.
 * @param {Number} [m12=0.0] - The value for row 0, column 1.
 * @param {Number} [m13=0.0] - The value for row 0, column 2.
 * @param {Number} [m21=0.0] - The value for row 1, column 0.
 * @param {Number} [m22=0.0] - The value for row 1, column 1.
 * @param {Number} [m23=0.0] - The value for row 1, column 2.
 * @param {Number} [m31=0.0] - The value for row 2, column 0.
 * @param {Number} [m32=0.0] - The value for row 2, column 1.
 * @param {Number} [m33=0.0] - The value for row 2, column 2.
 *
 * @classdesc
 * Represents a 3x3 matrix. The elements are stored in a `Float32Array`
 * in column-major order to optimise handoff to WebGL.
 */
Zia.Matrix3 = function ( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {
  /**
   * The matrix elements.
   * @type {Float32Array}
   */
  this.elements = new Float32Array( 9 );

  var te = this.elements;

  te[ 0 ] = ( n11 !== undefined ) ? n11 : 1; te[ 3 ] = n12 || 0; te[ 6 ] = n13 || 0;
  te[ 1 ] = n21 || 0; te[ 4 ] = ( n22 !== undefined ) ? n22 : 1; te[ 7 ] = n23 || 0;
  te[ 2 ] = n31 || 0; te[ 5 ] = n32 || 0; te[ 8 ] = ( n33 !== undefined ) ? n33 : 1;

};

Zia.Matrix3.prototype = {

  constructor: Zia.Matrix3,

  set: function ( n11, n12, n13, n21, n22, n23, n31, n32, n33 ) {

    var te = this.elements;

    te[ 0 ] = n11; te[ 3 ] = n12; te[ 6 ] = n13;
    te[ 1 ] = n21; te[ 4 ] = n22; te[ 7 ] = n23;
    te[ 2 ] = n31; te[ 5 ] = n32; te[ 8 ] = n33;

    return this;

  },

  identity: function () {

    this.set(

      1, 0, 0,
      0, 1, 0,
      0, 0, 1

    );

    return this;

  },

  copy: function ( m ) {

    var me = m.elements;

    this.set(

      me[ 0 ], me[ 3 ], me[ 6 ],
      me[ 1 ], me[ 4 ], me[ 7 ],
      me[ 2 ], me[ 5 ], me[ 8 ]

    );

    return this;

  },

  applyToVector3Array: function () {

    var v1 = new Zia.Vector3();

    return function ( array, offset, length ) {

      if ( offset === undefined ) offset = 0;
      if ( length === undefined ) length = array.length;

      for ( var i = 0, j = offset, il; i < length; i += 3, j += 3 ) {

        v1.x = array[ j ];
        v1.y = array[ j + 1 ];
        v1.z = array[ j + 2 ];

        v1.applyMatrix3( this );

        array[ j ]     = v1.x;
        array[ j + 1 ] = v1.y;
        array[ j + 2 ] = v1.z;

      }

      return array;

    };

  }(),

  multiplyScalar: function ( s ) {

    var te = this.elements;

    te[ 0 ] *= s; te[ 3 ] *= s; te[ 6 ] *= s;
    te[ 1 ] *= s; te[ 4 ] *= s; te[ 7 ] *= s;
    te[ 2 ] *= s; te[ 5 ] *= s; te[ 8 ] *= s;

    return this;

  },

  determinant: function () {

    var te = this.elements;

    var a = te[ 0 ], b = te[ 1 ], c = te[ 2 ],
      d = te[ 3 ], e = te[ 4 ], f = te[ 5 ],
      g = te[ 6 ], h = te[ 7 ], i = te[ 8 ];

    return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;

  },

  getInverse: function ( matrix, throwOnNonInvertible ) {

    // input: Zia.Matrix4
    // ( based on http://code.google.com/p/webgl-mjs/ )

    var me = matrix.elements;
    var te = this.elements;

    te[ 0 ] =   me[ 10 ] * me[ 5 ] - me[ 6 ] * me[ 9 ];
    te[ 1 ] = - me[ 10 ] * me[ 1 ] + me[ 2 ] * me[ 9 ];
    te[ 2 ] =   me[ 6 ] * me[ 1 ] - me[ 2 ] * me[ 5 ];
    te[ 3 ] = - me[ 10 ] * me[ 4 ] + me[ 6 ] * me[ 8 ];
    te[ 4 ] =   me[ 10 ] * me[ 0 ] - me[ 2 ] * me[ 8 ];
    te[ 5 ] = - me[ 6 ] * me[ 0 ] + me[ 2 ] * me[ 4 ];
    te[ 6 ] =   me[ 9 ] * me[ 4 ] - me[ 5 ] * me[ 8 ];
    te[ 7 ] = - me[ 9 ] * me[ 0 ] + me[ 1 ] * me[ 8 ];
    te[ 8 ] =   me[ 5 ] * me[ 0 ] - me[ 1 ] * me[ 4 ];

    var det = me[ 0 ] * te[ 0 ] + me[ 1 ] * te[ 3 ] + me[ 2 ] * te[ 6 ];

    // no inverse

    if ( det === 0 ) {

      var msg = "Matrix3.getInverse(): can't invert matrix, determinant is 0";

      if ( throwOnNonInvertible || false ) {

        throw new Error( msg );

      } else {

        console.warn( msg );

      }

      this.identity();

      return this;

    }

    this.multiplyScalar( 1.0 / det );

    return this;

  },

  transpose: function () {

    var tmp, m = this.elements;

    tmp = m[ 1 ]; m[ 1 ] = m[ 3 ]; m[ 3 ] = tmp;
    tmp = m[ 2 ]; m[ 2 ] = m[ 6 ]; m[ 6 ] = tmp;
    tmp = m[ 5 ]; m[ 5 ] = m[ 7 ]; m[ 7 ] = tmp;

    return this;

  },

  flattenToArrayOffset: function ( array, offset ) {

    var te = this.elements;

    array[ offset     ] = te[ 0 ];
    array[ offset + 1 ] = te[ 1 ];
    array[ offset + 2 ] = te[ 2 ];

    array[ offset + 3 ] = te[ 3 ];
    array[ offset + 4 ] = te[ 4 ];
    array[ offset + 5 ] = te[ 5 ];

    array[ offset + 6 ] = te[ 6 ];
    array[ offset + 7 ] = te[ 7 ];
    array[ offset + 8 ]  = te[ 8 ];

    return array;

  },

  getNormalMatrix: function ( m ) {

    // input: Zia.Matrix4

    this.getInverse( m ).transpose();

    return this;

  },

  transposeIntoArray: function ( r ) {

    var m = this.elements;

    r[ 0 ] = m[ 0 ];
    r[ 1 ] = m[ 3 ];
    r[ 2 ] = m[ 6 ];
    r[ 3 ] = m[ 1 ];
    r[ 4 ] = m[ 4 ];
    r[ 5 ] = m[ 7 ];
    r[ 6 ] = m[ 2 ];
    r[ 7 ] = m[ 5 ];
    r[ 8 ] = m[ 8 ];

    return this;

  },

  fromArray: function ( array ) {

    this.elements.set( array );

    return this;

  },

  toArray: function () {

    var te = this.elements;

    return [
      te[ 0 ], te[ 1 ], te[ 2 ],
      te[ 3 ], te[ 4 ], te[ 5 ],
      te[ 6 ], te[ 7 ], te[ 8 ]
    ];

  },

  clone: function () {

    var te = this.elements;

    return new Zia.Matrix3(

      te[ 0 ], te[ 3 ], te[ 6 ],
      te[ 1 ], te[ 4 ], te[ 7 ],
      te[ 2 ], te[ 5 ], te[ 8 ]

    );

  }

};