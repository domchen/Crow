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
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ts = require("typescript");
var Action = require("./Action");
var excludeModules = ["sys"];
var PrivateFlag = (function (_super) {
    __extends(PrivateFlag, _super);
    function PrivateFlag() {
        _super.apply(this, arguments);
    }
    PrivateFlag.prototype.formatFile = function (sourceFile, textFile) {
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
    PrivateFlag.prototype.formatModule = function (declaration, text, textFile, isPrivate) {
        if (declaration.body.kind == 189 /* ModuleDeclaration */) {
            var ns = declaration.name.text;
            if (excludeModules.indexOf(ns) != -1) {
                isPrivate = true;
            }
            this.formatModule(declaration.body, text, textFile, isPrivate);
            return;
        }
        var statements = declaration.body.statements;
        var length = statements.length;
        for (var i = 0; i < length; i++) {
            var statement = statements[i];
            switch (statement.kind) {
                case 185 /* ClassDeclaration */:
                    this.formatClass(statement, text, textFile, isPrivate);
                    break;
                case 186 /* InterfaceDeclaration */:
                    this.formatInterface(statement, text, textFile, isPrivate);
                    break;
                case 188 /* EnumDeclaration */:
                    this.formatEnum(statement, text, textFile, isPrivate);
                    break;
                case 164 /* VariableStatement */:
                    statement = statement.declarations[0];
                case 184 /* FunctionDeclaration */:
                case 183 /* VariableDeclaration */:
                    this.fommatComment(statement, text, textFile, isPrivate);
                    break;
            }
        }
    };
    PrivateFlag.prototype.formatClass = function (declaration, text, textFile, isPrivate) {
        var members = declaration.members;
        if (!(declaration.flags & 1 /* Export */)) {
            isPrivate = true;
        }
        var length = members.length;
        for (var i = 0; i < length; i++) {
            var member = members[i];
            switch (member.kind) {
                case 125 /* Method */:
                case 124 /* Property */:
                case 126 /* Constructor */:
                    this.fommatComment(member, text, textFile, isPrivate);
                    break;
            }
        }
    };
    PrivateFlag.prototype.formatInterface = function (declaration, text, textFile, isPrivate) {
        if (!(declaration.flags & 1 /* Export */)) {
            isPrivate = true;
        }
        var members = declaration.members;
        var length = members.length;
        for (var i = 0; i < length; i++) {
            var member = members[i];
            this.fommatComment(member, text, textFile, isPrivate);
        }
    };
    PrivateFlag.prototype.formatEnum = function (declaration, text, textFile, isPrivate) {
        if (!(declaration.flags & 1 /* Export */)) {
            isPrivate = true;
        }
        var members = declaration.members;
        var length = members.length;
        for (var i = 0; i < length; i++) {
            var member = members[i];
            this.fommatComment(member, text, textFile, isPrivate);
        }
    };
    PrivateFlag.prototype.fommatComment = function (node, text, textFile, isPrivate) {
    };
    return PrivateFlag;
})(Action);
