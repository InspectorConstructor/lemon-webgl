// test divide
var assert = require('assert');
math = require('../../../index.js'),
    approx = require('../../../tools/approx.js'),
    divide = math.divide,
    complex = math.complex;

describe('divide', function() {
  it('should divide two numbers', function() {
    assert.equal(divide(4, 2), 2);
    assert.equal(divide(-4, 2), -2);
    assert.equal(divide(4, -2), -2);
    assert.equal(divide(-4, -2), 2);
    assert.equal(divide(4, 0), Infinity);
    assert.equal(divide(-4, 0), -Infinity);
    assert.equal(divide(0, -5), 0);
    assert.ok(isNaN(divide(0, 0)));
  });

  it('should divide booleans', function() {
    assert.equal(divide(true, true), 1);
    assert.equal(divide(true, false), Infinity);
    assert.equal(divide(false, true), 0);
    assert.ok(isNaN(divide(false, false)));
  });

  it('should add mixed numbers and booleans', function() {
    assert.equal(divide(2, true), 2);
    assert.equal(divide(2, false), Infinity);
    approx.equal(divide(true, 2), 0.5);
    assert.equal(divide(false, 2), 0);
  });

  it('should divide two complex numbers', function() {
    approx.deepEqual(divide(complex('2+3i'), 2), complex('1+1.5i'));
    approx.deepEqual(divide(complex('2+3i'), complex('4i')), complex('0.75 - 0.5i'));
    approx.deepEqual(divide(complex('2i'), complex('4i')), complex('0.5'));
    approx.deepEqual(divide(4, complex('1+2i')), complex('0.8 - 1.6i'));
    approx.deepEqual(divide(math.i, 0), complex(0, Infinity));
    approx.deepEqual(divide(complex(0,1), 0), complex(0, Infinity));
    approx.deepEqual(divide(complex(1,0), 0), complex(Infinity, 0));
    approx.deepEqual(divide(complex(0,1), complex(0,0)), complex(0, Infinity));
    approx.deepEqual(divide(complex(1,1), complex(0,0)), complex(Infinity, Infinity));
    approx.deepEqual(divide(complex(1,-1), complex(0,0)), complex(Infinity, -Infinity));
    approx.deepEqual(divide(complex(-1,1), complex(0,0)), complex(-Infinity, Infinity));
    approx.deepEqual(divide(complex(1,1), complex(0,1)), complex(1, -1));
    approx.deepEqual(divide(complex(1,1), complex(1,0)), complex(1, 1));

    approx.deepEqual(divide(complex(2, 3), complex(4, 5)), complex('0.5609756097560976 + 0.0487804878048781i'));
    approx.deepEqual(divide(complex(2, 3), complex(4, -5)), complex('-0.170731707317073 + 0.536585365853659i'));
    approx.deepEqual(divide(complex(2, 3), complex(-4, 5)), complex('0.170731707317073 - 0.536585365853659i'));
    approx.deepEqual(divide(complex(2, 3), complex(-4, -5)), complex('-0.5609756097560976 - 0.0487804878048781i'));
    approx.deepEqual(divide(complex(2, -3), complex(4, 5)), complex('-0.170731707317073 - 0.536585365853659i'));
    approx.deepEqual(divide(complex(2, -3), complex(4, -5)), complex('0.5609756097560976 - 0.0487804878048781i'));
    approx.deepEqual(divide(complex(2, -3), complex(-4, 5)), complex('-0.5609756097560976 + 0.0487804878048781i'));
    approx.deepEqual(divide(complex(2, -3), complex(-4, -5)), complex('0.170731707317073 + 0.536585365853659i'));
    approx.deepEqual(divide(complex(-2, 3), complex(4, 5)), complex('0.170731707317073 + 0.536585365853659i'));
    approx.deepEqual(divide(complex(-2, 3), complex(4, -5)), complex('-0.5609756097560976 + 0.0487804878048781i'));
    approx.deepEqual(divide(complex(-2, 3), complex(-4, 5)), complex('0.5609756097560976 - 0.0487804878048781i'));
    approx.deepEqual(divide(complex(-2, 3), complex(-4, -5)), complex('-0.170731707317073 - 0.536585365853659i'));
    approx.deepEqual(divide(complex(-2, -3), complex(4, 5)), complex('-0.5609756097560976 - 0.0487804878048781i'));
    approx.deepEqual(divide(complex(-2, -3), complex(4, -5)), complex('0.170731707317073 - 0.536585365853659i'));
    approx.deepEqual(divide(complex(-2, -3), complex(-4, 5)), complex('-0.170731707317073 + 0.536585365853659i'));
    approx.deepEqual(divide(complex(-2, -3), complex(-4, -5)), complex('0.5609756097560976 + 0.0487804878048781i'));
  });

  it('should divide units by a number', function() {
    assert.equal(divide(math.unit('5 m'), 10).toString(), '500 mm');
  });

  it('should divide each elements in a matrix by a number', function() {
    assert.deepEqual(divide(math.range(2,8,2), 2), [1,2,3]);
    a  = math.matrix([[1,2],[3,4]]);
    assert.deepEqual(divide(a, 2), math.matrix([[0.5,1],[1.5,2]]));
    assert.deepEqual(divide(a.valueOf(), 2), [[0.5,1],[1.5,2]]);
    assert.deepEqual(divide([], 2), []);
    assert.deepEqual(divide([], 2), []);
  }); 

  it('should divide 1 over a matrix (matrix inverse)', function() {
    assert.deepEqual(math.format(divide(1, [
      [ 1, 4,  7],
      [ 3, 0,  5],
      [-1, 9, 11]
    ])), math.format([
      [ 5.625, -2.375, -2.5],
      [ 4.75,  -2.25,  -2],
      [-3.375,  1.625,  1.5]
    ]));
  });

  it('should perform matrix division', function() {
    a = math.matrix([[1,2],[3,4]]);
    b = math.matrix([[5,6],[7,8]]);
    assert.deepEqual(divide(a, b), math.matrix([[3,-2], [2,-1]]));
  });

  it('should divide a matrix by a matrix containing a scalar', function() {
    assert.throws(function () {divide(a, [[1]])});
  });

  it('should throw an error if dividing a number by a unit', function() {
    assert.throws(function () {divide(10, math.unit('5 m')).toString()});
  });

  it('should throw an error if there\'s wrong number of arguments', function() {
    assert.throws(function () {divide(2,3,4); });
    assert.throws(function () {divide(2); });
  });

});
