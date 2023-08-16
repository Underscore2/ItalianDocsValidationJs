"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvalidRegexError = exports.InvalidInputError = void 0;
var InvalidInputError = /** @class */ (function (_super) {
    __extends(InvalidInputError, _super);
    function InvalidInputError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = "InvalidInputError";
        return _this;
    }
    return InvalidInputError;
}(Error));
exports.InvalidInputError = InvalidInputError;
var InvalidRegexError = /** @class */ (function (_super) {
    __extends(InvalidRegexError, _super);
    function InvalidRegexError(message) {
        var _this = _super.call(this, message) || this;
        _this.name = 'InvalidRegexError';
        return _this;
    }
    return InvalidRegexError;
}(Error));
exports.InvalidRegexError = InvalidRegexError;
