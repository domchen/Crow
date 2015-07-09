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
var VisitNode = require("./VisitNode");
var FileUtil = require("./lib/FileUtil");
var PublicProps = (function (_super) {
    __extends(PublicProps, _super);
    function PublicProps() {
        _super.apply(this, arguments);
        this.excludeKeys = ["__bindables__", "__classFlag__", "__defaultProperty__", "__hashCode__", "__class__", "__meta__", "__global", "__typeFlags__", "__types__"];
    }
    PublicProps.prototype.run = function (srcPath) {
        _super.prototype.run.call(this, srcPath);
        this.excludeKeys.sort();
        var data = { props: this.excludeKeys };
        var str = JSON.stringify(data);
        FileUtil.save("larkprops.json", str);
    };
    PublicProps.prototype.visitPublic = function (node, text, textFile) {
        var name;
        if (node.kind == 164 /* VariableStatement */) {
            name = node.declarations[0].name.getText();
        }
        else if ("name" in node) {
            name = node["name"].getText();
        }
        if (name && this.excludeKeys.indexOf(name) == -1) {
            this.excludeKeys.push(name);
        }
    };
    return PublicProps;
})(VisitNode);
module.exports = PublicProps;
