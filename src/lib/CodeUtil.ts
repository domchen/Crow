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

export function createComment(indent:string, content:string):string {
    var comment = indent + "/**\n";
    var lines = content.split("\n");
    var length = lines.length;
    for (var i = 0; i < length; i++) {
        var line = lines[i];
        comment += indent + " * " + line + "\n";
    }
    comment += indent + " */";
    return comment;
}

export function getLineStartIndex(text:string, pos:number):number {
    text = text.substring(0, pos);
    var nIndex = text.lastIndexOf("\n");
    if (nIndex == -1) {
        nIndex = Number.POSITIVE_INFINITY;
    }
    var rIndex = text.lastIndexOf("\n");
    if (rIndex == -1) {
        rIndex = Number.POSITIVE_INFINITY;
    }
    var index = Math.min(rIndex, nIndex);
    if (index == Number.POSITIVE_INFINITY) {
        return 0;
    }
    return index + 1;
}

export function getIndent(text:string, startIndex:number):string {
    if (!text)
        return "";
    var indent:string = "";
    var char = text.charAt(startIndex);
    while (startIndex < text.length && (char == " " || char == "\t" || char == "\n" || char == "\r" || char == "\f")) {
        indent += char;
        startIndex++;
        char = text.charAt(startIndex);
    }
    return indent;
}