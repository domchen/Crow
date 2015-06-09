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


import ParamTag = require("./ParamTag");
import VersionTag = require("./VersionTag");
import PrivateTag = require("./PrivateTag");
import LanguageTag = require("./LanguageTag");
import PublicProps = require("./PublicProps");


class Entry {

    public run(srcPath:string):void {
        var args:string[] = process.argv.slice(2)
        var length = args.length;
        if (length == 0) {
            var paramTag = new ParamTag();
            paramTag.run(srcPath);

            var versionTag = new VersionTag();
            versionTag.run(srcPath);

            var privateTag = new PrivateTag();
            privateTag.run(srcPath);

            var languageTag = new LanguageTag();
            languageTag.run(srcPath);
        }
        else {
            for (var i = 0; i < length; i++) {
                var arg = args[i].toLowerCase();
                switch (arg) {
                    case "-param":
                        var paramTag = new ParamTag();
                        paramTag.run(srcPath);
                        break;
                    case "-version":
                        var versionTag = new VersionTag();
                        versionTag.run(srcPath);
                        break;
                    case "-private":
                        var privateTag = new PrivateTag();
                        privateTag.run(srcPath);
                        break;
                    case "-language":
                        var languageTag = new LanguageTag();
                        languageTag.run(srcPath);
                        break;
                    case "-props":
                        var props = new PublicProps();
                        props.run(srcPath);
                        break;
                }
            }
        }

    }

}

var entry = new Entry();
entry.run(process.cwd());
