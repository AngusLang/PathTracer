import { Arch } from "./core/Arch";
import { dom } from "./lib/lan";
import { OBJLoader } from "./loaders/OBJLoader";
import { Scene } from "./core/Scene";
import { BVH } from "./accelerator/BVH";
import { HDRLoad } from "./loaders/HDRLoader";

const canvas = dom('view') as HTMLCanvasElement
const arch = new Arch(canvas);
const status = dom('status') as HTMLElement;

OBJLoader('./obj', 'home').then((pack) => {
    console.log(pack);
    console.log(HDRLoad('./hdr/grass.hdr'));
    arch.bindScene(new Scene(pack, new BVH()));
    arch.render();
    // sceneTest(arch.scene);
});

status.onclick = function() {
    const link = document.createElement('a');
    link.download = 'sample.png';
    const source = canvas.toDataURL();
    console.log(source);
    link.href = source;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
