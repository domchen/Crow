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


class LanguageTag extends VisitNode {

    protected visitPublic(node:ts.Node, text:string, textFile:TextFile):void {
        var lineStart = CodeUtil.getLineStartIndex(text, node.getStart());
        var indent = CodeUtil.getIndent(text, lineStart);
        var enText = indent + " * @language en_US";
        var cnText = indent + " * @language zh_CN";
        var comments:ts.CommentRange[] = ts.getLeadingCommentRanges(text, node.getFullStart());
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
            textFile.update(range.pos, range.end, enLines.join("\n")+"\n"+indent+cnLines.join("\n"));
        }
    }
}

export = LanguageTag;