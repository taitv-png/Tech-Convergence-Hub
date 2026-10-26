import { tr } from './locale';
import * as THREE from 'three';
import { createRoomArchitecture, type RoomOpening } from './room-architecture';

// PDF page 3: 658.08 drawing points correspond to the dimensioned 21.10 m.
// Furniture dimensions are estimates from Scenes 134–143, not surveyed measurements.
export const ROOM104 = { width: 273.12 / (658.08 / 21.1), depth: 158.64 / (658.08 / 21.1), height: 3 };
export type RoomObstacle = { x: number; z: number; w: number; d: number };
export const ROOM_ITEMS = [
  { name: tr("Khu bàn học", "Study area"), x: -2.15, z: .9, title: tr("Bàn đôi mặt gỗ · ghế khung thép", "Wood double desks · steel-frame chairs"), description: tr("Cụm bàn học hướng về màn hình di động, với lối đi dọc bên dãy kệ. Tái dựng 5 bàn đôi và 10 ghế theo các góc render.", "Desks facing the mobile screen, with an aisle along the shelves. Five double desks and ten chairs rebuilt from the render angles."), action: tr("Xem khu bàn học", "View the study area") },
  { name: tr("Màn hình di động", "Mobile screen"), x: .05, z: 1.03, title: tr("Màn hình trình chiếu trên chân bánh xe", "Presentation screen on a wheeled stand"), description: tr("Màn hình lớn đặt giữa khu bàn học và khu làm việc. Nhấn nút để bật / tắt nội dung trình chiếu mẫu.", "A large screen between the study and work areas. Press the button to turn the sample content on or off."), action: tr("Bật / tắt màn hình", "Screen on / off") },
  { name: tr("Dãy kệ trưng bày", "Display shelves"), x: -2.15, z: -2.27, title: tr("Ba khoang kệ kim loại màu đen", "Three black metal shelf bays"), description: tr("Kệ mở nhiều tầng chạy dọc tường, dành cho trưng bày vật mẫu và học liệu. Các ngăn được để trống như ảnh thiết kế.", "Open shelves along the wall for samples and learning materials. The shelves are left empty, as in the design images."), action: tr("Xem dãy kệ", "View the shelves") },
  { name: tr("Tủ hồ sơ", "File cabinet"), x: .05, z: -2.25, title: tr("Tủ trắng · ngăn mở và cánh đóng", "White cabinet · open shelves and closed doors"), description: tr("Tủ cao kết hợp ngăn sách, hồ sơ và khoang lưu trữ đóng. Nhấn nút để thử mở / đóng hai cánh tủ dưới.", "A tall cabinet with book and file shelves and closed storage. Press the button to open or close the two lower doors."), action: tr("Mở / đóng tủ", "Open / close cabinet") },
  { name: tr("Quầy cà phê", "Coffee bar"), x: 1.48, z: -2.18, title: tr("Quầy gỗ · máy pha cà phê", "Wood counter · coffee machine"), description: tr("Khu tiện ích có máy pha, cốc và kệ phía trên, cạnh bàn cao. Nhấn nút để chạy hiệu ứng pha cà phê minh họa.", "A service corner with a coffee machine, cups and shelves above, next to the high table. Press the button for a coffee demo."), action: tr("Thử pha cà phê", "Brew a coffee") },
  { name: tr("Bàn cao", "High table"), x: 3.05, z: -2.18, title: tr("Bàn mặt gỗ · khung thép đen", "Wood top · black steel frame"), description: tr("Bàn cao nối tiếp quầy cà phê, có hai khay đặt trên mặt bàn và giữ khoảng trống trước cửa cuối phòng.", "A high table continuing the coffee bar, with two trays, keeping the space in front of the rear door clear."), action: tr("Xem bàn cao", "View the high table") },
  { name: tr("Khu máy tính", "Computer area"), x: 2.45, z: .65, title: tr("Ba máy tính · bàn làm việc đối diện", "Three computers · facing desks"), description: tr("Hai máy tính phía ghế trắng, một máy phía ghế tựa cao. Màn hình, bàn phím và đèn bàn dựng theo ảnh; chưa gán cấu hình thiết bị thực tế.", "Two computers on the white-chair side and one on the high-back side. Screens, keyboards and lamps follow the photos; no real hardware specification is implied."), action: tr("Bật / tắt máy tính", "Computer on / off") },
  { name: tr("Tủ thấp & cây xanh", "Low cabinet & plants"), x: .95, z: .64, title: tr("Tủ thấp chia ngăn · chậu cây dài", "Divided low cabinet · long planter"), description: tr("Tủ thấp đặt ở đầu cụm bàn làm việc, phía trên có chậu cây, ngăn nhẹ khu máy tính với khu trình chiếu.", "A low cabinet at the end of the work desks, with a planter on top, gently separating the computers from the presentation area."), action: tr("Xem tủ và cây", "View the cabinet and plants") },
] as const;

export function createRoom104(scene: THREE.Scene, furnished: boolean, openings: 'render' | 'pdf') {
  const { width: w, depth: d, height: h } = ROOM104;
  const obstacles: RoomObstacle[] = [], interactables: THREE.Object3D[] = [];
  const materials: THREE.Material[] = [], textures: THREE.Texture[] = [];
  const mat = (color: number, opacity = 1) => { const m = new THREE.MeshStandardMaterial({ color, roughness: .72, transparent: opacity < 1, opacity, depthWrite: opacity === 1 }); materials.push(m); return m; };
  const white = mat(0xf2f0e9), metal = mat(0x272d2e), steel = mat(0x9c9d98), glass = mat(0xafd6d9, .21), wood = mat(0xc39868), darkWood = mat(0x655242), black = mat(0x12191c), green = mat(0x447445);
  const box = (a: number, b: number, c: number, x: number, y: number, z: number, material: THREE.Material, parent: THREE.Object3D = scene) => { const mesh = new THREE.Mesh(new THREE.BoxGeometry(a,b,c), material); mesh.position.set(x,y,z); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh; };
  const cylinder = (r: number, length: number, x: number, y: number, z: number, material: THREE.Material, parent: THREE.Object3D) => { const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r,r,length,10),material); mesh.position.set(x,y,z); parent.add(mesh); return mesh; };
  // Subtle procedural wood grain and ceramic joints; these are material textures.
  const timber = document.createElement('canvas'); timber.width = 512; timber.height = 256;
  const ctx = timber.getContext('2d')!;ctx.fillStyle='#c59b6f';ctx.fillRect(0,0,512,256);
  for(let i=0;i<140;i++){ctx.strokeStyle=`rgba(91,59,32,${.04+(i%7)*.014})`;ctx.lineWidth=.4+(i%3)*.35;ctx.beginPath();for(let x=0;x<=512;x+=8){const y=i*2+Math.sin(x*.016+i)*1.6;x?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.stroke()}
  const grain=new THREE.CanvasTexture(timber);grain.colorSpace=THREE.SRGBColorSpace;grain.wrapS=grain.wrapT=THREE.RepeatWrapping;textures.push(grain);wood.map=grain;
  const floor=box(w,.12,d,0,-.06,0,mat(0xe8e5df));floor.userData.walkable=true;
  const joint=mat(0xc9c9c2);for(let x=-w/2+.6;x<w/2;x+=.6)box(.006,.002,d,x,.002,0,joint);for(let z=-d/2+.6;z<d/2;z+=.6)box(w,.002,.006,0,.002,z,joint);
  const overhead=new THREE.Group();scene.add(overhead);
  const s=658.08/21.1;
  const pdfDoors=[{from:(160.76-122.12)/s,to:(192.68-122.12)/s},{from:(127.04-122.12)/s,to:(162.2-122.12)/s}];
  const doorRanges=openings==='pdf'?pdfDoors:[{from:.64,to:1.92},{from:.52,to:1.80}];
  const architectureOpenings:RoomOpening[]=[];
  for(let side=0;side<2;side++){
    const wallSide=side===0?'west':'east';
    architectureOpenings.push({side:wallSide,from:-d/2+doorRanges[side].from,to:-d/2+doorRanges[side].to,top:2.25,kind:'door'});
    const windows=openings==='pdf'?(side===1?[{from:(170.96-122.12)/s,to:(221.48-122.12)/s},{from:(224.6-122.12)/s,to:(271.4-122.12)/s}]:[]):(side===0?[{from:2.17,to:3.65}]:[]);
    windows.forEach(window=>architectureOpenings.push({side:wallSide,from:-d/2+window.from,to:-d/2+window.to,bottom:1.02,top:2.25,kind:'window'}));
  }
  const architecture=createRoomArchitecture(scene,{width:w,depth:d,height:h,openings:architectureOpenings,namePrefix:'room104-wall'});
  const front=architecture.groups.south;
  const addObstacle=(x:number,z:number,a:number,c:number)=>obstacles.push({x,z,w:a,d:c});
  const groups=ROOM_ITEMS.map((_,i)=>{const group=new THREE.Group();group.userData.station=i;scene.add(group);if(furnished)interactables.push(group);return group});
  const screens:THREE.MeshStandardMaterial[]=[];const cabinetDoors:THREE.Group[]=[];const steam:THREE.Mesh[]=[];
  const screenMat=()=>{const m=mat(0x142127);m.emissive.set(0x247f8b);m.emissiveIntensity=.08;screens.push(m);return m};
  function chair(x:number,z:number,angle:number,office=false,executive=false,parent:THREE.Object3D=scene){
    const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=angle;parent.add(g);
    const seat=office?(executive?mat(0x92969a):white):wood;
    box(.43,.065,.43,0,.46,0,seat,g);box(.44,executive?.78:.36,.055,0,executive?.85:.69,.2,seat,g);
    if(office){cylinder(.035,.38,0,.23,0,steel,g);for(let i=0;i<5;i++){const leg=box(.035,.035,.29,0,.07,.14,metal,g);leg.rotation.y=i*Math.PI*.4;leg.position.set(Math.sin(i*Math.PI*.4)*.13,.07,Math.cos(i*Math.PI*.4)*.13);cylinder(.035,.05,Math.sin(i*Math.PI*.4)*.26,.04,Math.cos(i*Math.PI*.4)*.26,metal,g)}}
    else{for(const a of [-.17,.17]){box(.035,.42,.035,a,.23,-.15,steel,g);box(.035,.7,.035,a,.37,.17,steel,g);box(.035,.035,.48,a,.04,0,steel,g)}}
    addObstacle(x,z,.46,.48);
  }
  if(furnished){
    // Three rows, 2+2+1 double desks, all facing the presentation screen (+X).
    for(const [row,x] of [-3.45,-2.30,-1.15].entries())for(const [col,z] of [.07,1.44].entries()){
      if(row===2&&col===0)continue;const g=groups[0];box(.48,.055,1.2,x,.74,z,wood,g);box(.36,.13,1.1,x,.65,z,white,g);addObstacle(x,z,.5,1.22);
      for(const dz of [-.5,.5]){box(.065,.70,.065,x,.35,z+dz,steel,g);box(.55,.055,.065,x,.04,z+dz,steel,g)}
      for(const dz of [-.31,.31])chair(x-.43,z+dz,-Math.PI/2,false,false,g);
    }
    // Open black display shelves, three bays, eleven fine shelves each.
    for(const x of [-3.45,-2.30,-1.15]){const g=groups[2];for(const dx of [-.53,.53])for(const dz of [-.2,.2])box(.035,2.48,.035,x+dx,1.24,-2.25+dz,metal,g);for(let y=.16;y<2.5;y+=.225)box(1.1,.028,.44,x,y,-2.25,metal,g);addObstacle(x,-2.25,1.1,.44)}
    const cabinet=groups[3];box(1.13,2.52,.05,.08,1.26,-2.46,white,cabinet);for(const dx of [-.55,.55])box(.04,2.52,.48,.08+dx,1.26,-2.23,white,cabinet);for(const y of [.12,.88,1.3,1.72,2.13,2.5])box(1.14,.035,.49,.08,y,-2.23,white,cabinet);
    for(const [i,x] of [-.22,.35].entries()){const sign=i?-1:1,pivot=new THREE.Group();pivot.position.set(x-sign*.275,.47,-1.97);cabinet.add(pivot);box(.54,.72,.04,sign*.27,0,0,white,pivot);box(.025,.14,.035,sign*.48,.02,.035,metal,pivot);cabinetDoors.push(pivot)}
    const bookColors=[0x557678,0xd2c0a0,0x747b84,0x8d583d];for(let i=0;i<17;i++){const level=i<8?1.34:1.77;box(.035+(i%3)*.012,.19+(i%4)*.02,.22,-.4+(i%8)*.095,level+.12,-2.13,mat(bookColors[i%4]),cabinet)}addObstacle(.08,-2.23,1.14,.5);
    const pantry=groups[4];box(1.55,.88,.59,1.46,.44,-2.2,darkWood,pantry);box(1.60,.045,.66,1.46,.91,-2.17,white,pantry);box(1.55,1.52,.05,1.46,1.73,-2.47,darkWood,pantry);for(const x of [.68,2.24])box(.04,1.55,.4,x,1.72,-2.27,darkWood,pantry);for(const y of [1.63,2.1,2.49])box(1.6,.035,.42,1.46,y,-2.28,white,pantry);
    for(let i=0;i<12;i++)box(.014,.79,.014,.74+i*.125,.46,-1.894,wood,pantry);
    box(.48,.64,.44,1.75,1.25,-2.11,metal,pantry);box(.24,.18,.025,1.75,1.43,-1.88,screenMat(),pantry);box(.34,.025,.30,1.75,.96,-1.86,steel,pantry);cylinder(.105,.16,1.75,1.65,-2.14,glass,pantry);
    for(const x of [.97,1.25,1.57,1.90])cylinder(.045,.12,x,1.72,-2.2,white,pantry);cylinder(.045,.075,1.75,1.015,-1.85,white,pantry);
    for(let i=0;i<5;i++){const puff=new THREE.Mesh(new THREE.SphereGeometry(.025,8,6),mat(0xffffff,.3));puff.position.set(1.75,1.08+i*.08,-1.85);puff.visible=false;pantry.add(puff);steam.push(puff)}addObstacle(1.46,-2.17,1.6,.66);
    const bar=groups[5];box(1.7,.045,.45,3.15,1.0,-2.2,wood,bar);for(const x of [2.35,3.95])for(const z of [-2.37,-2.03])box(.035,.98,.035,x,.49,z,metal,bar);for(const x of [2.73,3.56]){box(.48,.025,.3,x,1.04,-2.2,metal,bar);box(.42,.008,.24,x,1.056,-2.2,white,bar)}addObstacle(3.15,-2.2,1.7,.45);
    const tv=groups[1];box(.075,1.12,1.95,.05,1.57,1.03,metal,tv);box(.012,1.04,1.86,-.0,1.57,1.03,screenMat(),tv);for(const z of [.47,1.59]){box(.055,.91,.055,.05,.50,z,metal,tv);box(.64,.065,.06,.05,.09,z,metal,tv);for(const x of [-.22,.32])cylinder(.045,.045,x,.045,z,steel,tv)}addObstacle(.05,1.03,.66,1.95);
    const work=groups[6];for(const z of [.2,1.18]){box(2.7,.055,.73,2.64,.75,z,wood,work);for(const x of [1.35,3.93])for(const dz of [-.28,.28])box(.04,.72,.04,x,.36,z+dz,metal,work);addObstacle(2.64,z,2.7,.73)}
    for(const [x,z,rotation] of [[2.0,.20,0],[3.25,.20,0],[2.7,1.18,Math.PI]]){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rotation;work.add(g);box(.60,.40,.045,0,1.08,0,white,g);box(.55,.32,.012,0,1.1,-.03,screenMat(),g);box(.06,.18,.07,0,.84,.04,steel,g);box(.24,.02,.16,0,.785,.04,white,g);box(.34,.015,.12,0,.79,-.25,white,g);for(let i=0;i<8;i++)box(.003,.002,.09,-.145+i*.04,.799,-.25,steel,g)}
    chair(2.0,-.46,Math.PI,true,false,work);chair(3.25,-.46,Math.PI,true,false,work);chair(2.7,1.92,0,true,true,work);
    box(.45,.54,.48,2.60,.27,-.1,white,work);box(2.5,.53,.28,2.64,.265,2.30,darkWood,work);addObstacle(2.64,2.30,2.5,.28);
    const divider=groups[7];for(const y of [.22,.9])box(.38,.04,1.13,.92,y,.64,white,divider);for(const z of [.09,.45,.84,1.19])box(.38,.65,.025,.92,.56,z,white,divider);box(.03,.7,1.14,.73,.56,.64,white,divider);for(const z of [.12,1.16])box(.035,.23,.035,.92,.115,z,metal,divider);box(.35,.19,.87,.92,1.015,.64,white,divider);addObstacle(.92,.64,.40,1.15);
    for(let i=0;i<42;i++){const leaf=new THREE.Mesh(new THREE.SphereGeometry(.11,7,5),green);leaf.scale.set(.65,.30,1);leaf.position.set(.92+Math.sin(i*2.4)*(.08+(i%3)*.06),1.14+Math.sin(i*1.7)*.10,.64+Math.cos(i*2.4)*(.12+(i%4)*.10));leaf.rotation.set(i*.23,i*.81,.2);divider.add(leaf)}
    // Wall-mounted split ACs and ceiling tracks are visible in the supplied renders.
    for(const x of [-1.9,2.4]){box(1.0,.29,.21,x,2.56,d/2-.15,white,front);box(.85,.045,.025,x,2.46,d/2-.27,steel,front)}
    for(const x of [-2.8,0,2.8])for(const z of [-1.25,1.25]){box(1.1,.035,.045,x,2.89,z,metal,overhead);for(const offset of [-.42,0,.42]){const light=cylinder(.045,.12,x+offset,2.8,z,metal,overhead);light.rotation.z=.36}}
  }
  const selection=new THREE.BoxHelper(new THREE.Object3D(),0xed742d);selection.visible=false;scene.add(selection);
  // Keep overhead equipment legible without obscuring the room or avatar.
  overhead.traverse(o=>{if(o instanceof THREE.Mesh){const m=(o.material as THREE.Material).clone();m.transparent=true;m.opacity=.18;m.depthWrite=false;o.material=m;o.castShadow=false}});
  front.children.forEach(o=>{if(o instanceof THREE.Mesh&&o.position.y>2.4){const m=(o.material as THREE.Material).clone();m.transparent=true;m.opacity=.18;m.depthWrite=false;o.material=m;o.castShadow=false;o.userData.faded=true}});
  let selected=-1,cabinetOpen=false,coffeeUntil=0;const displayState={tv:false,computers:false};
  const highlight=(i:number)=>{selected=i;selection.visible=i>=0&&furnished;if(selection.visible)selection.setFromObject(groups[i])};
  const activate=(i:number)=>{if(i===1||i===6){const key=i===1?'tv':'computers';displayState[key]=!displayState[key];const enabled=displayState[key];(i===1?screens.slice(1,2):screens.slice(2)).forEach(m=>{m.color.set(enabled?0x176d80:0x142127);m.emissiveIntensity=enabled?.8:.08})}if(i===3)cabinetOpen=!cabinetOpen;if(i===4)coffeeUntil=performance.now()+4500;};
  const update=(time:number,dt:number,camera:THREE.Camera,top:boolean)=>{
    overhead.visible=!top;
    const settling=architecture.update(camera,top,dt);
    cabinetDoors.forEach((g,i)=>{g.rotation.y=THREE.MathUtils.damp(g.rotation.y,cabinetOpen?(i?1:-1)*1.2:0,9,dt)});
    steam.forEach((p,i)=>{p.visible=time<coffeeUntil;p.position.y=1.10+((time*.00017+i*.06)%.40);p.scale.setScalar(1+(p.position.y-1.1)*2)});
    if(selected>=0&&selection.visible)selection.update();
    return settling||time<coffeeUntil||cabinetDoors.some((g,i)=>Math.abs(g.rotation.y-(cabinetOpen?(i?1:-1)*1.2:0))>.001);
  };
  return {floor,obstacles,interactables,highlight,activate,update,start:new THREE.Vector3(-w/2+.55,0,-d/2+(doorRanges[0].from+doorRanges[0].to)/2),textures};
}

export type StudentVariant = 'male'|'female'|'casual-male'|'casual-female';

export function createStudent(scene:THREE.Scene,variant:StudentVariant='male',paletteIndex=0){
  const root=new THREE.Group(),model=new THREE.Group();root.add(model);scene.add(root);
  const mat=(color:number,roughness=.62)=>new THREE.MeshStandardMaterial({color,roughness,metalness:0});
  const female=variant==='female'||variant==='casual-female',casual=variant.startsWith('casual'),hero=!casual;
  const casualShirts=[0x4f75a1,0xc56a4a,0x6c8b63,0x8a6e9f,0xd1a13b,0x3f7f7b],casualBottoms=[0x303943,0x5a4b43,0x384a5b,0x4a3d59];
  const shirt=mat(casual?casualShirts[paletteIndex%casualShirts.length]:0x0a9a96),trim=mat(casual?0xece5da:0xff7a33),skin=mat([0xf1c4a0,0xd9a07a,0xf5d0b0][paletteIndex%3],.55),hair=mat([0x1f1a18,0x3b2620,0x15171a][paletteIndex%3],.4);
  const pants=mat(casual?casualBottoms[paletteIndex%casualBottoms.length]:0x2c3a4c),skirt=mat(casual?casualBottoms[(paletteIndex+1)%casualBottoms.length]:0x24364a),shoe=mat(paletteIndex%2?0x2c3237:0xf5f2ea,.5),sole=mat(0xffffff,.7),dark=mat(0x16191c,.3),white=mat(0xffffff,.2),blush=new THREE.MeshStandardMaterial({color:0xff8f8f,transparent:true,opacity:.45,roughness:.9,depthWrite:false});
  const shapes:THREE.BufferGeometry[]=[];const sphere=new THREE.SphereGeometry(1,22,16);shapes.push(sphere);
  const add=<T extends THREE.Mesh>(mesh:T,parent:THREE.Object3D=model)=>{mesh.castShadow=true;parent.add(mesh);return mesh};
  const ball=(x:number,y:number,z:number,a:number,b:number,c:number,m:THREE.Material,parent:THREE.Object3D=model)=>{const mesh=add(new THREE.Mesh(sphere,m),parent);mesh.position.set(x,y,z);mesh.scale.set(a,b,c);return mesh};
  const capsule=(r:number,len:number,m:THREE.Material,parent:THREE.Object3D,y:number,sx=1,sz=1)=>{const g=new THREE.CapsuleGeometry(r,len,6,14);shapes.push(g);const mesh=add(new THREE.Mesh(g,m),parent);mesh.position.y=y;mesh.scale.set(sx,1,sz);return mesh};
  // torso: rounded shirt + hem + collar
  capsule(female?.19:.205,.30,shirt,model,1.13,1,.72);
  ball(0,.9,0,female?.2:.215,.085,.15,shirt);
  const hem=new THREE.Mesh(new THREE.TorusGeometry(female?.19:.205,.022,8,28),trim);shapes.push(hem.geometry);hem.rotation.x=Math.PI/2;hem.scale.set(1,.72,1);hem.position.y=.86;add(hem);
  const collar=new THREE.Mesh(new THREE.TorusGeometry(.085,.022,8,24),trim);shapes.push(collar.geometry);collar.rotation.x=Math.PI/2;collar.position.y=1.39;add(collar);
  // backpack (UEH students carry one) — straps over the shoulders
  if(hero||paletteIndex%2===0){const pack=new THREE.Group();pack.position.set(0,1.13,-.17);model.add(pack);
    const packMat=mat(hero?0xff7a33:0x3b4a55,.7);const body=new THREE.Mesh(new THREE.BoxGeometry(.3,.38,.13),packMat);shapes.push(body.geometry);add(body,pack);
    ball(0,-.02,-.07,.13,.15,.04,packMat,pack);ball(0,.19,0,.15,.03,.065,packMat,pack);
    const pocket=new THREE.Mesh(new THREE.BoxGeometry(.2,.13,.04),mat(hero?0xe0662a:0x2f3c45,.7));shapes.push(pocket.geometry);pocket.position.set(0,-.08,-.08);add(pocket,pack);
    const strapMat=mat(hero?0xd85a20:0x26323a,.7);for(const x of [-.135,.135]){const over=new THREE.Mesh(new THREE.BoxGeometry(.035,.022,.3),strapMat);shapes.push(over.geometry);over.position.set(x,1.405,-.01);add(over);const strap=new THREE.Mesh(new THREE.BoxGeometry(.032,.2,.018),strapMat);shapes.push(strap.geometry);strap.position.set(x,1.3,.135);strap.rotation.x=-.25;add(strap)}}
  // head
  const head=new THREE.Group();head.position.y=1.62;model.add(head);
  const neck=new THREE.Mesh(new THREE.CylinderGeometry(.06,.068,.12,14),skin);shapes.push(neck.geometry);neck.position.y=1.43;add(neck);
  ball(0,0,0,.19,.205,.18,skin,head);
  for(const x of [-.185,.185])ball(x,-.01,0,.032,.048,.03,skin,head);
  // face
  for(const x of [-.068,.068]){ball(x,.0,.158,.03,.04,.018,dark,head);ball(x+.01,.016,.172,.009,.011,.005,white,head);ball(x,-.052,.15,.036,.018,.008,blush,head);
    const brow=ball(x,.07,.162,.034,.008,.008,hair,head);brow.rotation.z=x<0?.12:-.12}
  ball(0,-.03,.178,.018,.016,.016,skin,head);
  const smile=new THREE.Mesh(new THREE.TorusGeometry(.03,.006,6,16,Math.PI),mat(0x9a4b3e,.6));shapes.push(smile.geometry);smile.rotation.z=Math.PI;smile.position.set(0,-.072,.168);add(smile,head);
  if(variant==='male'){for(const x of [-.068,.068]){const lens=new THREE.Mesh(new THREE.TorusGeometry(.045,.0055,8,22),dark);shapes.push(lens.geometry);lens.position.set(x,.002,.176);add(lens,head)}const bridge=new THREE.Mesh(new THREE.BoxGeometry(.04,.006,.006),dark);shapes.push(bridge.geometry);bridge.position.set(0,.01,.18);add(bridge,head)}
  // hair
  ball(0,.07,-.02,.205,.17,.195,hair,head);
  ball(0,.02,-.07,.2,.17,.16,hair,head);
  if(female){
    const fringe=ball(-.05,.11,.11,.15,.07,.09,hair,head);fringe.rotation.z=.25;ball(.09,.1,.12,.1,.06,.07,hair,head);
    for(const x of [-.17,.17])ball(x,-.1,-.02,.06,.2,.09,hair,head);
    ball(0,-.13,-.12,.17,.24,.08,hair,head);
    const tie=new THREE.Mesh(new THREE.TorusGeometry(.03,.012,6,14),trim);shapes.push(tie.geometry);tie.position.set(0,.02,-.2);add(tie,head);
  }else{
    const quiff=ball(.04,.15,.09,.15,.07,.1,hair,head);quiff.rotation.z=-.3;ball(-.1,.12,.09,.09,.06,.08,hair,head);
    for(const x of [-.17,.17])ball(x,.04,-.02,.04,.09,.12,hair,head);
  }
  if(female){const sk=new THREE.Mesh(new THREE.CylinderGeometry(.2,.31,.4,22),skirt);shapes.push(sk.geometry);sk.position.y=.75;sk.scale.z=.78;add(sk)}
  // limbs (pivots: 0,1 arms · 2,3 legs)
  const limbs:THREE.Group[]=[];
  for(const [x,y,isArm] of [[-.238,1.3,1],[.238,1.3,1],[-.1,female?.66:.86,0],[.1,female?.66:.86,0]]){
    const pivot=new THREE.Group();pivot.position.set(x,y,0);model.add(pivot);limbs.push(pivot);
    if(isArm){capsule(.068,.12,shirt,pivot,-.08);const cuff=new THREE.Mesh(new THREE.TorusGeometry(.066,.014,6,18),trim);shapes.push(cuff.geometry);cuff.rotation.x=Math.PI/2;cuff.position.y=-.2;add(cuff,pivot);capsule(.05,.16,skin,pivot,-.32);ball(0,-.47,.005,.058,.062,.05,skin,pivot);pivot.rotation.z=x<0?-.08:.08}
    else{const legLen=female?.36:.56;capsule(female?.058:.078,legLen,female?skin:pants,pivot,-legLen/2-.04);const footY=-(legLen+.13);ball(0,footY,.04,.09,.06,.15,shoe,pivot);ball(0,footY-.04,.04,.093,.018,.155,sole,pivot)}
  }
  let texture:THREE.CanvasTexture|undefined;
  if(hero){const canvas=document.createElement('canvas');canvas.width=256;canvas.height=128;const c=canvas.getContext('2d')!;c.fillStyle='#0a9a96';c.fillRect(0,0,256,128);c.fillStyle='white';c.font='bold 72px Arial';c.textAlign='center';c.fillText('UEH',128,77);c.fillStyle='#ffd2b8';c.font='bold 20px Arial';c.fillText('UNIVERSITY',128,106);texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const badge=new THREE.Mesh(new THREE.PlaneGeometry(.13,.065),new THREE.MeshBasicMaterial({map:texture}));shapes.push(badge.geometry);badge.position.set(0,1.18,.152);model.add(badge)}
  const shadow=new THREE.Mesh(new THREE.CircleGeometry(.3,28),new THREE.MeshBasicMaterial({color:0x1d3134,transparent:true,opacity:.24,depthWrite:false}));shapes.push(shadow.geometry);shadow.rotation.x=-Math.PI/2;shadow.position.y=.012;root.add(shadow);
  let velocity=0,height=0,clock=paletteIndex*1.7,swing=0;
  return {root,jump:()=>{if(height===0)velocity=3.9},update:(dt:number,moving:boolean,time:number)=>{
    clock+=dt;velocity-=10.5*dt;height=Math.max(0,height+velocity*dt);if(height===0)velocity=0;
    swing=THREE.MathUtils.damp(swing,moving?1:0,10,dt);
    const phase=time,bob=moving?Math.abs(Math.sin(phase))*.035:Math.sin(clock*2.2)*.008;
    model.position.y=height+bob;
    model.rotation.z=Math.sin(phase)*.03*swing;
    head.rotation.y=(1-swing)*Math.sin(clock*.7)*.18;head.rotation.x=Math.sin(clock*1.1)*.03;
    limbs.forEach((part,i)=>{const s=Math.sin(phase+(i%2?Math.PI:0))*(i<2?-.6:.55);part.rotation.x=height>0?(i<2?-.9:.3):s*swing});
    shadow.scale.setScalar(1-height*.2)},
    dispose:()=>{texture?.dispose();shapes.forEach(g=>g.dispose())}};
}
