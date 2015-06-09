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


/// <reference path="./lib/types.d.ts" />

import ts = require("typescript");
import TextFile = require("./TextFile");
import VisitNode = require("./VisitNode");
import CodeUtil = require("./lib/CodeUtil");


class VersionFlag extends VisitNode {

    public static versions = ["Lark 1.0"];
    public static platforms = "Web,Runtime,Native";

    protected visitPublic(node:ts.Node, text:string, textFile:TextFile):void {
        var content = "";
        var strings:string[] = [];
        for (var i = 0; i < VersionFlag.versions.length; i++) {
            strings.push("@version " + VersionFlag.versions[i]);
        }
        content += strings.join("\n");
        content += "\n@platform "+VersionFlag.platforms;

        var lineStart = CodeUtil.getLineStartIndex(text, node.getStart());
        var indent = CodeUtil.getIndent(text, lineStart);
        var newText = CodeUtil.createComment(indent, content);
        var comments:ts.CommentRange[] = ts.getLeadingCommentRanges(text, node.getFullStart());
        if (!comments || comments.length == 0) {
            textFile.update(lineStart, lineStart, newText + "\n");
        }
        else {
            var versionLines = newText.split("\n");
            versionLines.pop();
            versionLines.shift();
            var length = comments.length;
            for (i = 0; i < length; i++) {
                var range = comments[i];
                var comment = text.substring(range.pos, range.end);
                if (comment.indexOf("@version") != -1 || comment.indexOf("*/") == -1) {
                    continue;
                }
                var lines = comment.split("\r\n").join("\n").split("\r").join("\n").split("\n");
                var lastLine = lines.pop();
                lines = lines.concat(versionLines);
                lines.push(lastLine);
                textFile.update(range.pos, range.end, lines.join("\n"));
            }
        }
    }
}

export = VersionFlag;