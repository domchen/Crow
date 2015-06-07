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
/// <reference path="../lib/types.d.ts" />

import ts = require("typescript");
import TextFile = require("./TextFile");
import Action = require("./Action");

var excludeModules = ["sys"];

class PrivateFlag extends Action{

    protected formatFile(sourceFile:ts.SourceFile,textFile:TextFile):void{
        var text = sourceFile.text;
        var statements = sourceFile.statements;
        var length = statements.length;
        for (var i = 0; i < length; i++) {
            var statement = statements[i];
            if (statement.kind == ts.SyntaxKind.ModuleDeclaration) {
                this.formatModule(<ts.ModuleDeclaration>statement, text, textFile);
            }
        }
    }

    private formatModule(declaration:ts.ModuleDeclaration, text:string, textFile:TextFile, isPrivate?:boolean):void {
        if (declaration.body.kind == ts.SyntaxKind.ModuleDeclaration) {
            var ns = declaration.name.text;
            if (excludeModules.indexOf(ns) != -1) {
                isPrivate = true;
            }
            this.formatModule(<ts.ModuleDeclaration>declaration.body, text, textFile, isPrivate);
            return;
        }
        var statements:ts.Node[] = (<ts.ModuleBlock>declaration.body).statements;
        var length = statements.length;
        for (var i = 0; i < length; i++) {
            var statement = statements[i];
            switch (statement.kind) {
                case ts.SyntaxKind.ClassDeclaration:
                    this.formatClass(<ts.ClassDeclaration>statement, text, textFile, isPrivate);
                    break;
                case ts.SyntaxKind.InterfaceDeclaration:
                    this.formatInterface(<ts.InterfaceDeclaration>statement, text, textFile, isPrivate);
                    break;
                case ts.SyntaxKind.EnumDeclaration:
                    this.formatEnum(<ts.EnumDeclaration>statement, text, textFile, isPrivate);
                    break;
                case ts.SyntaxKind.VariableStatement:
                    statement = (<ts.VariableStatement>statement).declarations[0];
                case ts.SyntaxKind.FunctionDeclaration:
                case ts.SyntaxKind.VariableDeclaration:
                    this.fommatComment(<ts.EnumDeclaration>statement, text, textFile, isPrivate);
                    break;
            }
        }
    }

    private formatClass(declaration:ts.ClassDeclaration, text:string, textFile:TextFile, isPrivate:boolean):void {
        var members = declaration.members;
        if (!(declaration.flags & ts.NodeFlags.Export)) {
            isPrivate = true;
        }
        var length = members.length;
        for (var i = 0; i < length; i++) {
            var member = members[i];
            switch (member.kind) {
                case ts.SyntaxKind.Method:
                case ts.SyntaxKind.Property:
                case ts.SyntaxKind.Constructor:
                    this.fommatComment(member, text, textFile, isPrivate);
                    break;
            }
        }
    }

    private formatInterface(declaration:ts.InterfaceDeclaration, text:string, textFile:TextFile, isPrivate:boolean):void {
        if (!(declaration.flags & ts.NodeFlags.Export)) {
            isPrivate = true;
        }
        var members = declaration.members;
        var length = members.length;
        for (var i = 0; i < length; i++) {
            var member = members[i];
            this.fommatComment(member, text, textFile, isPrivate);
        }
    }

    private formatEnum(declaration:ts.EnumDeclaration, text:string, textFile:TextFile, isPrivate:boolean) {
        if (!(declaration.flags & ts.NodeFlags.Export)) {
            isPrivate = true;
        }

        var members = declaration.members;
        var length = members.length;
        for (var i = 0; i < length; i++) {
            var member = members[i];
            this.fommatComment(member, text, textFile, isPrivate);
        }
    }

    private fommatComment(node:ts.Node, text, textFile:TextFile, isPrivate:boolean):void {

    }
}