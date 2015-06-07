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
import Action = require("./Action");
var CodeUtil = require("./lib/CodeUtil");

class FunctionComment extends Action {

    protected formatFile(sourceFile:ts.SourceFile, textFile:TextFile):void {
        var text = sourceFile.text;
        var walkNode = (node:ts.Node) => {
            var declaration:ts.FunctionLikeDeclaration = null;
            switch (node.kind) {
                case ts.SyntaxKind.FunctionDeclaration:
                case ts.SyntaxKind.Method:
                    var name = (<ts.FunctionLikeDeclaration>node).name.getText();
                    if(name.charAt(0)=="$"||name.charAt(0)=="_"){
                        break;
                    }
                    var flags = node.flags;
                    if(flags>0&&
                        !((flags&ts.NodeFlags.Public)||
                        (flags&ts.NodeFlags.Protected)||
                        (flags&ts.NodeFlags.Export))){
                        break;
                    }
                    declaration = <ts.FunctionLikeDeclaration>node;
                    break;
            }
            if (declaration) {
                var comments = ts.getLeadingCommentRanges(text, declaration.getFullStart())
                if (!comments || comments.length == 0) {
                    var content = "\n";
                    var parameters = declaration.parameters;
                    if (parameters) {
                        var args:string[] = [];
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
                            content += "\n@returns "
                        }
                    }

                    var lineStart = CodeUtil.getLineStartIndex(text, declaration.getStart());
                    var indent = CodeUtil.getIndent(text, lineStart);
                    var newText = CodeUtil.createComment(indent, content)+"\n";
                    textFile.update(lineStart, lineStart, newText);
                }

            }
            ts.forEachChild(node, walkNode);
        };
        walkNode(sourceFile);
    }
}

export = FunctionComment;