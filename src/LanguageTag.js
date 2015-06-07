//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="./lib/types.d.ts" />
var ts = require("typescript");
var VisitNode = require("./VisitNode");
var CodeUtil = require("./lib/CodeUtil");
var LanguageTag = (function (_super) {
    __extends(LanguageTag, _super);
    function LanguageTag() {
        _super.apply(this, arguments);
    }
    LanguageTag.prototype.visitPublic = function (node, text, textFile) {
        var lineStart = CodeUtil.getLineStartIndex(text, node.getStart());
        var indent = CodeUtil.getIndent(text, lineStart);
        var enText = indent + " * @language en_US";
        var cnText = indent + " * @language zh_CN";
        var comments = ts.getLeadingCommentRanges(text, node.getFullStart());
        if (comments && comments.length > 0) {
            var range = comments[comments.length - 1];
            var comment = text.substring(range.pos, range.end);
            if (comment.indexOf("@language") != -1 || comment.indexOf("*/") == -1) {
                return;
            }
            var cnLines = comment.split("\r\n").join("\n").split("\r").join("\n").split("\n");
            var enLines = cnLines.concat();
            cnLines.splice(1, 0, cnText);
            enLines.splice(1, 0, enText);
            textFile.update(range.pos, range.end, enLines.join("\n") + "\n" + indent + cnLines.join("\n"));
        }
    };
    return LanguageTag;
})(VisitNode);
module.exports = LanguageTag;
