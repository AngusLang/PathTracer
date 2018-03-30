

const Ajax = function () {
    // this is just a helper class to ease ajax calls
    var scope = this;
    this.xmlhttp = new XMLHttpRequest();
    this.get = function (url, callback) {
        scope.xmlhttp.onreadystatechange = function () {
            if (scope.xmlhttp.readyState === 4) {
                callback(scope.xmlhttp.responseText, scope.xmlhttp.status);
            }
        };
        scope.xmlhttp.open('GET', url, true);
        scope.xmlhttp.send();
    }
};

const re_vector  = /^v\s/;
const re_normal  = /^vn\s/;
const re_face = /^f\s/;
const re_space   = /\s+/;

function vertiesAbsorb(data: string): Float32Array {
    const res = [];
    const vs = [];
    const vn = [];
    const fs = [];

    const lines = data.split('\n');
    var i = -1
    while ( ++i < lines.length) {
        const line = lines[i].trim()
        const elements = line.split(re_space)
        elements.shift();

        if ( re_vector.test( line ) ) {
            vs.push([elements[0], elements[1], elements[2]]);
        } else if ( re_normal.test( line ) ) {
            vn.push([elements[0], elements[1], elements[2]]);
        } else if ( re_face.test(line) ) {
            
            let j  = -1
            let indices = [];
            let n;

            while (++j < elements.length) {
                var is = elements[j].split('/')
                indices.push(is[0])
                n = is[2];
            }

            indices.push(n);
            fs.push(indices);
        }
    }
    for( i = 0; i < fs.length; ++i ) {
        const v0 = vs[ fs[i][0] - 1 ];
        const v1 = vs[ fs[i][1] - 1 ];
        const v2 = vs[ fs[i][2] - 1 ];
        const n0 = vn[ fs[i][3] - 1 ];
        res.push(n0[0], n0[1], n0[2]);
        res.push(
            v0[0], v0[1], v0[2],
            v1[0], v1[1], v1[2],
            v2[0], v2[1], v2[2]
        );
        
    }
    return new Float32Array(res);
}

export async function OBJLoader( path ): Promise<Float32Array>{

    var ajax = new Ajax();

    return new Promise<Float32Array>( (resolve, reject) => {
        ajax.get(path, function (data, status) {
            resolve( vertiesAbsorb(data) );
        })
    });

}