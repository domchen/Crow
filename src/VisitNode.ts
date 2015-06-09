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

import ts = require("typescript");
import TextFile = require("./TextFile");
import Action = require("./Action");

class VisitNode extends Action {

    public static privateModules = ["sys","web","native"];

    protected formatFile(sourceFile:ts.SourceFile, textFile:TextFile):void {
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

    private formatModule(declaration:ts.ModuleDeclaration, text:string, textFile:TextFile,isPrivate?:boolean):void {
        var ns = declaration.name.text;
        if (VisitNode.privateModules.indexOf(ns) != -1) {
            isPrivate = true;
        }
        if (declaration.body.kind == ts.SyntaxKind.ModuleDeclaration) {
            this.formatModule(<ts.ModuleDeclaration>declaration.body, text, textFile,isPrivate);
            return;
        }
        var statements:ts.Node[] = (<ts.ModuleBlock>declaration.body).statements;
        var length = statements.length;
        for (var i = 0; i < length; i++) {
            var statement = statements[i];
            var name:string = "";
            if (statement.kind == ts.SyntaxKind.VariableStatement) {
                name = (<ts.VariableStatement>statement).declarations[0].name.getText();
            }
            else if ("name" in statement) {
                name = statement["name"].getText();
            }
            if (name.charAt(0) == "$" || name.charAt(0) == "_") {
                this.visitPrivate(statement,text,textFile);
                continue;
            }
            if (!(statement.flags & ts.NodeFlags.Export)) {
                this.visitPrivate(statement,text,textFile);
                continue;
            }
            switch (statement.kind) {
                case ts.SyntaxKind.InterfaceDeclaration:
                case ts.SyntaxKind.EnumDeclaration:
                case ts.SyntaxKind.ClassDeclaration:
                    this.formatMembers(<ts.EnumDeclaration>statement, text, textFile,isPrivate);
                    break;
                case ts.SyntaxKind.VariableStatement:
                case ts.SyntaxKind.FunctionDeclaration:
                case ts.SyntaxKind.VariableDeclaration:
                    if(isPrivate){
                        this.visitPrivate(statement,text,textFile);
                    }
                    else{
                        this.visitPublic(<ts.EnumDeclaration>statement, text, textFile);
                    }
                    break;
            }
        }
    }

    private formatMembers(declaration:ts.Declaration, text:string, textFile:TextFile,isPrivate?:boolean):void {
        var members:ts.Declaration[] = declaration["members"];
        var length = members.length;
        for (var i = 0; i < length; i++) {
            var member = members[i];
            if ("name" in member) {
                var name = member.name.getText();
                if (name.charAt(0) == "$" || name.charAt(0) == "_") {
                    this.visitPrivate(member,text,textFile);
                    continue;
                }
            }

            var flags = member.flags;
            if (!isPrivate&&
                (flags == 0 || (flags & ts.NodeFlags.Public) || (flags & ts.NodeFlags.Protected))) {
                this.visitPublic(member, text, textFile);
            }
            else{
                this.visitPrivate(member,text,textFile);
            }
        }
        if(isPrivate){
            this.visitPrivate(declaration,text,textFile);
        }
        else{
            this.visitPublic(declaration, text, textFile);
        }
    }

    protected visitPublic(node:ts.Node, text:string, textFile:TextFile):void {

    }

    protected visitPrivate(node:ts.Node, text:string, textFile:TextFile):void {

    }
}

export = VisitNode;