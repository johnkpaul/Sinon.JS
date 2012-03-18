/*jslint onevar: false, eqeqeq: false*/
/*globals testCase
          window
          sinon
          fail
          assert
          assertUndefined
          assertFalse
          assertArray
          assertFunction
          assertNumber
          assertNoException
          assertSame
          assertNotSame
          assertException
          assertEquals*/
/**
 * @author Christian Johansen (christian@cjohansen.no)
 * @license BSD
 *
 * Copyright (c) 2010-2011 Christian Johansen
 */
"use strict";

if (typeof require == "function" && typeof testCase == "undefined") {
    var testCase = require("../test_case_shim");
    var sinon = require("../../lib/sinon");
}

(function () {
    testCase("MatchTest", {
        "should be function": function () {
            assertFunction(sinon.match);
        },

        "should return instance of Matcher": function () {
            assert(sinon.match(function () {}) instanceof sinon.match.Matcher);
        }
    });

    testCase("MatcherTest", {
        "should be function": function () {
            assertFunction(sinon.match.Matcher);
        },

        "should require function argument": function () {
            assertException(function () {
                sinon.match.Matcher();
            }, "TypeError");
        },

        "should expose test function": function () {
            var test = function () {};

            var matcher = new sinon.match.Matcher(test);

            assertSame(test, matcher.test);
        }
    });

    testCase("MatchAnyTest", {
        "should return instance of Matcher": function () {
            var any = sinon.match.any();

            assert(any instanceof sinon.match.Matcher);
        },

        "should return true when tested": function () {
            var any = sinon.match.any();

            assert(any.test());
        }
    });

    testCase("MatchSameTest", {
        "should return instance of Matcher": function () {
            var same = sinon.match.same();

            assert(same instanceof sinon.match.Matcher);
        },

        "should return true if test is called with same argument": function () {
            var object = {};
            var same = sinon.match.same(object);

            assert(same.test(object));
        },

        "should return false if test is not called with same argument": function () {
            var same = sinon.match.same({});

            assertFalse(same.test({}));
        }
    });

    testCase("MatchTypeOfTest", {
        "should throw if given argument is not a string": function () {
            assertException(function () {
                sinon.match.typeOf();
            }, "TypeError");
            assertException(function () {
                sinon.match.typeOf(123);
            }, "TypeError");
        },

        "should return instance of Matcher": function () {
            var typeOf = sinon.match.typeOf("string");

            assert(typeOf instanceof sinon.match.Matcher);
        },

        "should return true if test is called with string": function () {
            var typeOf = sinon.match.typeOf("string");

            assert(typeOf.test("Sinon.JS"));
        },

        "should return false if test is not called with string": function () {
            var typeOf = sinon.match.typeOf("string");

            assertFalse(typeOf.test(123));
        },

        "should return true if test is called with regexp": function () {
            var typeOf = sinon.match.typeOf("regexp");

            assert(typeOf.test(/.+/));
        },

        "should return false if test is not called with regexp": function () {
            var typeOf = sinon.match.typeOf("regexp");

            assertFalse(typeOf.test(true));
        }
    });

    testCase("MatchInstanceOfTest", {
        "should throw if given argument is not a function": function () {
            assertException(function () {
                sinon.match.instanceOf();
            }, "TypeError");
            assertException(function () {
                sinon.match.instanceOf("foo");
            }, "TypeError");
        },

        "should return instance of Matcher": function () {
            var instanceOf = sinon.match.instanceOf(function () {});

            assert(instanceOf instanceof sinon.match.Matcher);
        },

        "should return true if test is called with instance of argument": function () {
            var instanceOf = sinon.match.instanceOf(Array);

            assert(instanceOf.test([]));
        },

        "should return false if test is not called with instance of argument": function () {
            var instanceOf = sinon.match.instanceOf(Array);

            assertFalse(instanceOf.test({}));
        }
    });

    testCase("MatchReTest", {
        "should throw if given argument is not a regular expression": function () {
            assertException(function () {
                sinon.match.re();
            }, "TypeError");
            assertException(function () {
                sinon.match.re("foo");
            }, "TypeError");
        },

        "should return instance of Matcher": function () {
            var re = sinon.match.re(/.+/);

            assert(re instanceof sinon.match.Matcher);
        },

        "should return true if test is called with instance of argument": function () {
            var re = sinon.match.re(/[a-c]/);

            assert(re.test("b"));
        },

        "should return false if test is not called with instance of argument": function () {
            var re = sinon.match.re(/[a-c]/);

            assertFalse(re.test("d"));
        },

        "should return false if argument is not string": function () {
            var re = sinon.match.re(/.*/);

            assertFalse(re.test());
            assertFalse(re.test(null));
            assertFalse(re.test(123));
            assertFalse(re.test({}));
        }
    });

    testCase("MatchLikeTest", {
        "should return instance of Matcher": function () {
            var like = sinon.match.like({});

            assert(like instanceof sinon.match.Matcher);
        },

        "should throw if argument is not object": function () {
            assertException(function () {
                sinon.match.like([]);
            }, "TypeError");
        },

        "should return true if properties are equal": function () {
            var like = sinon.match.like({ str: "sinon", nr: 1 });

            assert(like.test({ str: "sinon", nr: 1, other: "ignored" }));
        },

        "should return true if properties are deep equal": function () {
            var like = sinon.match.like({ deep: { str: "sinon" } });

            assert(like.test({ deep: { str: "sinon", ignored: "value" } }));
        },

        "should return false if a property is not equal": function () {
          var like = sinon.match.like({ str: "sinon", nr: 1 });

          assertFalse(like.test({ str: "sinon", nr: 2 }));
        },

        "should return false if a property is missing": function () {
          var like = sinon.match.like({ str: "sinon", nr: 1 });

          assertFalse(like.test({ nr: 1 }));
        },

        "should return true if test matches": function () {
          var like = sinon.match.like({ prop: sinon.match.typeOf("boolean") });

          assert(like.test({ prop: true }));
        },

        "should return false if test does not match": function () {
          var like = sinon.match.like({ prop: sinon.match.typeOf("boolean") });

          assertFalse(like.test({ prop: "no" }));
        },

        "should return true if deep test matches": function () {
          var like = sinon.match.like({ deep: { prop: sinon.match.typeOf("boolean") } });

          assert(like.test({ deep: { prop: true } }));
        },

        "should return false if deep test does not match": function () {
          var like = sinon.match.like({ deep: { prop: sinon.match.typeOf("boolean") } });

          assertFalse(like.test({ deep: { prop: "no" } }));
        },

        "should return false if tested value is not object": function () {
          var like = sinon.match.like({});

          assertFalse(like.test(null));
          assertFalse(like.test(undefined));
          assertFalse(like.test("no"));
          assertFalse(like.test([]));
        }
    });
}());
