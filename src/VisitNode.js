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
var ts = require("typescript");
var Action = require("./Action");
var VisitNode = (function (_super) {
    __extends(VisitNode, _super);
    function VisitNode() {
        _super.apply(this, arguments);
    }
    VisitNode.prototype.formatFile = function (sourceFile, textFile) {
        var text = sourceFile.text;
        var statements = sourceFile.statements;
        var length = statements.length;
        for (var i = 0; i < length; i++) {
            var statement = statements[i];
            if (statement.kind == 189 /* ModuleDeclaration */) {
                this.formatModule(statement, text, textFile);
            }
        }
    };
    VisitNode.prototype.formatModule = function (declaration, text, textFile, isPrivate) {
        var ns = declaration.name.text;
        if (VisitNode.privateModules.indexOf(ns) != -1) {
            isPrivate = true;
        }
        if (declaration.body.kind == 189 /* ModuleDeclaration */) {
            this.formatModule(declaration.body, text, textFile, isPrivate);
            return;
        }
        var statements = declaration.body.statements;
        var length = statements.length;
        for (var i = 0; i < length; i++) {
            var statement = statements[i];
            var name = "";
            if (statement.kind == 164 /* VariableStatement */) {
                name = statement.declarations[0].name.getText();
            }
            else if ("name" in statement) {
                name = statement["name"].getText();
            }
            if (name.charAt(0) == "$" || name.charAt(0) == "_") {
                this.visitPrivate(statement, text, textFile);
                continue;
            }
            if (!(statement.flags & 1 /* Export */)) {
                this.visitPrivate(statement, text, textFile);
                continue;
            }
            switch (statement.kind) {
                case 186 /* InterfaceDeclaration */:
                case 188 /* EnumDeclaration */:
                case 185 /* ClassDeclaration */:
                    this.formatMembers(statement, text, textFile, isPrivate);
                    break;
                case 164 /* VariableStatement */:
                case 184 /* FunctionDeclaration */:
                case 183 /* VariableDeclaration */:
                    if (isPrivate) {
                        this.visitPrivate(statement, text, textFile);
                    }
                    else {
                        this.visitPublic(statement, text, textFile);
                    }
                    break;
            }
        }
    };
    VisitNode.prototype.formatMembers = function (declaration, text, textFile, isPrivate) {
        var members = declaration["members"];
        var length = members.length;
        for (var i = 0; i < length; i++) {
            var member = members[i];
            if (member.kind == 128 /* SetAccessor */) {
                continue;
            }
            if ("name" in member) {
                var name = member.name.getText();
                if (name.charAt(0) == "$" || name.charAt(0) == "_") {
                    this.visitPrivate(member, text, textFile);
                    continue;
                }
            }
            var flags = member.flags;
            if (!isPrivate && (flags == 0 || (flags & 16 /* Public */) || (flags & 64 /* Protected */))) {
                this.visitPublic(member, text, textFile);
            }
            else {
                this.visitPrivate(member, text, textFile);
            }
        }
        if (isPrivate) {
            this.visitPrivate(declaration, text, textFile);
        }
        else {
            this.visitPublic(declaration, text, textFile);
        }
    };
    VisitNode.prototype.visitPublic = function (node, text, textFile) {
    };
    VisitNode.prototype.visitPrivate = function (node, text, textFile) {
    };
    VisitNode.privateModules = ["sys", "web", "native"];
    return VisitNode;
})(Action);
module.exports = VisitNode;
