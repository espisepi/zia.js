var Zia;
(function (Zia) {
    var ModelMeshPart = (function () {
        function ModelMeshPart(options) {
            options = Zia.ObjectUtil.reverseMerge(options || {}, {
                indexBuffer: null,
                startIndex: 0,
                indexCount: 0,
                vertexBuffer: null
            });
            this.indexBuffer = options.indexBuffer;
            this.startIndex = options.startIndex;
            this.indexCount = options.indexCount;
            this.vertexBuffer = options.vertexBuffer;
            this._program = null;
            this._parent = null;
        }
        Object.defineProperty(ModelMeshPart.prototype, "program", {
            get: function () {
                return this._program;
            },
            set: function (value) {
                if (value === this._program)
                    return;
                if (this._program) {
                    var removeProgram = true;
                    for (var i = 0; i < this._parent.meshParts.length; i++) {
                        var meshPart = this._parent.meshParts[i];
                        if (meshPart !== this && meshPart._program === this._program) {
                            removeProgram = false;
                            break;
                        }
                    }
                    if (removeProgram) {
                        var programIndex = this._parent.programs.indexOf(this._program);
                        if (programIndex >= 0) {
                            this._parent.programs.splice(programIndex, 1);
                        }
                    }
                }
                this._program = value;
                this._parent.programs.push(value);
            },
            enumerable: true,
            configurable: true
        });
        return ModelMeshPart;
    })();
    Zia.ModelMeshPart = ModelMeshPart;
})(Zia || (Zia = {}));
