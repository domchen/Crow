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
var Action = require("./Action");
var CodeUtil = require("./lib/CodeUtil");
var FunctionComment = (function (_super) {
    __extends(FunctionComment, _super);
    function FunctionComment() {
        _super.apply(this, arguments);
    }
    FunctionComment.prototype.formatFile = function (sourceFile, textFile) {
        var text = sourceFile.text;
        var walkNode = function (node) {
            var declaration = null;
            switch (node.kind) {
                case 184 /* FunctionDeclaration */:
                case 125 /* Method */:
                    var name = node.name.getText();
                    if (name.charAt(0) == "$" || name.charAt(0) == "_") {
                        break;
                    }
                    var flags = node.flags;
                    if (flags > 0 && !((flags & 16 /* Public */) || (flags & 64 /* Protected */) || (flags & 1 /* Export */))) {
                        break;
                    }
                    declaration = node;
                    break;
            }
            if (declaration) {
                var comments = ts.getLeadingCommentRanges(text, declaration.getFullStart());
                if (!comments || comments.length == 0) {
                    var content = "\n";
                    var parameters = declaration.parameters;
                    if (parameters) {
                        var args = [];
                        for (var i = 0; i < parameters.length; i++) {
                            var para = parameters[i];
                            args.push("@param " + para.name.text + " ");
                        }
                        content += args.join("\n");
                    }
                    var typeNode = declaration.type;
                    if (typeNode) {
                        var type = text.substring(typeNode.pos, typeNode.end);
                        if (type && type != "void") {
                            content += "\n@returns ";
                        }
                    }
                    var lineStart = CodeUtil.getLineStartIndex(text, declaration.getStart());
                    var indent = CodeUtil.getIndent(text, lineStart);
                    var newText = CodeUtil.createComment(indent, content) + "\n";
                    textFile.update(lineStart, lineStart, newText);
                }
            }
            ts.forEachChild(node, walkNode);
        };
        walkNode(sourceFile);
    };
    return FunctionComment;
})(Action);
module.exports = FunctionComment;
