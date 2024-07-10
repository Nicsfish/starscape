"use strict";

var systems = [];
var warps = [];


var dirty = false;
var gradientTexture;

var largeLabels = [];
var smallLabels = [];

let container = new PIXI.Container();
container.cacheAsBitmap = true;
container.isRenderGroup = true;
container.filters = null;
container.interactiveChildren = false;
container.cullable = true;

let circle = new PIXI.GraphicsContext().circle(0, 0, DOT_RADIUS * 5).fill(0xFFFFFF, 1);

(async () => {
  
  await app.init({autoStart: false, canvas: canvas, background: '#000', resizeTo: window, resolution: window.devicePixelRatio, antialias: true });
  gradientTexture = await PIXI.Assets.load(`data/gradient.png`);
  app.stage.eventMode = 'none';
  app.stage.filters = null;
  app.stage.isRenderGroup = true;
  app.stage.cacheAsBitmap = true;
  app.stage.cullable = true;
  app.stage.addChild(container);


  let paths = [{name: "trade union", color: 0x27FAF5},{name: "the syndicate", color: 0xFAC227},{name: "mining guild", color: 0xFAE727}];

  for (let j=0;j<paths.length;j++) {
    let g = new PIXI.Graphics();
    g.moveTo(borders[paths[j].name][0].x,-borders[paths[j].name][0].y);
    for (let i=1;i<borders[paths[j].name].length;i++) {
      g.lineTo(borders[paths[j].name][i].x,-borders[paths[j].name][i].y);
    }
    g.lineTo(borders[paths[j].name][0].x,-borders[paths[j].name][0].y);
  
    g.stroke({ width: WARP_WIDTH * 1.5, color: paths[j].color});
    container.addChild(g);
  };
  

  let outer = new PIXI.Graphics();
  outer.moveTo(borders["outer"][0].x,-borders["outer"][0].y);
  for (let i=1;i<borders["outer"].length;i++) {
    outer.lineTo(borders["outer"][i].x,-borders["outer"][i].y);
  }
  outer.lineTo(borders["outer"][0].x,-borders["outer"][0].y);
  outer.stroke({ width: WARP_WIDTH * 1.5, texture: gradientTexture, matrix: new PIXI.Matrix(400,0,0,400,600,-350).rotate(3)});
  container.addChild(outer);

  let inner = new PIXI.Graphics();
  inner.moveTo(borders["inner"][0].x,-borders["inner"][0].y);
  for (let i=1;i<borders["inner"].length;i++) {
    inner.lineTo(borders["inner"][i].x,-borders["inner"][i].y);
  }
  inner.lineTo(borders["inner"][0].x,-borders["inner"][0].y);
  inner.stroke({ width: WARP_WIDTH * 1.5, texture: gradientTexture, matrix: new PIXI.Matrix(200,0,0,200,200,-100).rotate(3)});
  container.addChild(inner);
  
  gradientTexture.destroy();
  gradientTexture = null;
  borders = null;
  
  let labels = [
    {text: "THE CORE", x: 0, y: 42, size: 90, color: 0xFFFFFF, fontWeight: "700"},
    {text: "TRADE UNION", x: -66, y: -690, size: 80, color: 0xB5F5EE, fontWeight: "700"},
    {text: "MINING GUILD", x: 2038, y: 390, size: 80, color: 0xF5EEB5, fontWeight: "700"},
    {text: "THE SYNDICATE", x: -792, y: 2406, size: 80, color: 0xF5DFB5, fontWeight: "700"},
    {text: "KAVANI MANDATE", x: -1154, y: -264, size: 110, color: 0xB5F5B5, fontWeight: "700"},
    {text: "LYCENTIAN FEDERATION", x: 678, y: 840, size: 110, color: 0xB5D9F5, fontWeight: "700"},
    {text: "FORALKAN STAR EMPIRE", x: 1068, y: -1032, size: 110, color: 0xF5B5B5, fontWeight: "700"},
    {text: "ALTERAN REACH", x: 1266, y: -2610, size: 90, color: 0xFFFFFF, fontWeight: "700"},
    {text: "ETERNITY", x: -2496, y: 1128, size: 90, color: 0xFFFFFF, fontWeight: "700"},
    {text: "ARKANA", x: -2886, y: -876, size: 90, color: 0xFFFFFF, fontWeight: "700"},
    {text: "OLIVAVAN EXPANSE", x: 1812, y: 2640, size: 90, color: 0xFFFFFF, fontWeight: "700"},
    {text: "TERMINUS", x: -1392, y: -2586, size: 90, color: 0xFFFFFF, fontWeight: "700"},
    {text: "WILDAR", x: -756, y: 3084, size: 90, color: 0xFFFFFF, fontWeight: "700"},
    {text: "BEACON", x: 2694, y: 966, size: 90, color: 0xFFFFFF, fontWeight: "700"},
    {text: "SANCTUM", x: 2832, y: -912, size: 90, color: 0xFFFFFF, fontWeight: "700"},
    
    {text: "Catalyst", x: 462, y: 1212, size: 50, color: 0xFFFFFF, fontWeight: "600"},
    {text: "Contact", x: -618, y: 942, size: 50, color: 0xFFFFFF, fontWeight: "600"},
    {text: "Empyrean Highlands", x: 1110, y: -678, size: 50, color: 0xFFFFFF, fontWeight: "600"},
    {text: "First Mandate", x: -1284, y: 78, size: 50, color: 0xFFFFFF, fontWeight: "600"},
    {text: "Harvest", x: 1404, y: -1314, size: 50, color: 0xFFFFFF, fontWeight: "600"},
    {text: "Inner Core", x: 0, y: -48, size: 50, color: 0xFFFFFF, fontWeight: "600"},
    {text: "Passage", x: 618, y: -1278, size: 50, color: 0xFFFFFF, fontWeight: "600"},
    {text: "Schism", x: 1134, y: -150, size: 50, color: 0xFFFFFF, fontWeight: "600"},
    {text: "Second Mandate", x: -1068, y: -654, size: 50, color: 0xFFFFFF, fontWeight: "600"},
    {text: "Sentinel", x: 1026, y: 486, size: 50, color: 0xFFFFFF,fontWeight: "600"},
    {text: "Valence", x: -300, y: -1110, size: 50, color: 0xFFFFFF, fontWeight: "600"}
  ];
  for (let i=0;i<labels.length;i++) {
    let text = new PIXI.Text({
      text: labels[i].text,
      style:  new PIXI.TextStyle({
        fontFamily: 'Arial',
        fill: labels[i].color,
        fontSize: labels[i].size,
        
        fontWeight: labels[i].fontWeight,
      })
    });

    text.anchor.set(0.5, 0.5);
    text.x = labels[i].x;
    text.y = -labels[i].y;
    text.zIndex = 4;


    container.addChild(text);

    if (labels[i].size >= 80) {
      largeLabels.push(text);
      text.scale.set(0.9,1);
      text.style.letterSpacing = -2;
    } else {
      smallLabels.push(text);
    }
  }


  app.ticker.add(() =>
  {
    if (dirty) {
      devicePixelRatio = window.devicePixelRatio || 1;
      
      container.x = -posX + (app.screen.width / 2) * (1 - scale * builtInScale);
      container.y = -posY + (app.screen.height / 2) * (1 - scale * builtInScale);

      container.pivot.x = -app.screen.width/2;
      container.pivot.y = -app.screen.height/2;
      container.scale = scale * builtInScale;
      
      dirty = false;

      bounds();
      for (let i=0;i<warps.length;i++) {
        warps[i].update();
      }
      for (let i=0;i<systems.length;i++) {
        systems[i].update();
      }

      for (let i=0;i<largeLabels.length;i++) {
        largeLabels[i].alpha = 1-Math.min(1, scale-0.5)/0.5;
      }

      for (let i=0;i<smallLabels.length;i++) {
        if (scale < 0.3) {
          smallLabels[i].alpha = (scale - 0.1)/ 0.2;
        } else {
          smallLabels[i].alpha = 1-Math.min(1, scale-0.5)/0.5;
        }
      }
    }
  });
})();

fetch("./data/map.json")
  .then((res) => {
      if (!res.ok) {
          throw new Error
              (`Status: ${res.status}`);
      }
      return res.json();
  })
  .then((data) => {
    //let g = new PIXI.Graphics();
    //g.zIndex = 2;
    for (let i = 0; i < data.length; i++) {
      let s = new System(data[i].name, data[i].x, data[i].y, data[i]["security class"], data[i]["spectral class"], data[i]["spice color"]);

      systems.push(s);
      //g.circle(s.x, -s.y, DOT_RADIUS).fill(s.color, 1);
      
      container.addChild(s.graphics);
      container.addChild(s.text);
    }
    //container.addChild(g);
    circle = null;
    for (let i = 0; i < data.length; i++) {
      document.getElementById("searchResultText").innerText = "Systems: (" + i + ")";
      for (let j=0;j<data[i].warp.length;j++) {
        let s = findSystem(data[i].name);
        let e = findSystem(data[i].warp[j])
        if (!duplicateWarp(s, e)) {
          let w = new Warp(s, e);
          warps.push(w);

          container.addChild(w.graphics);
        }
      }
    }
    document.getElementById("searchResultText").innerText = "Systems: (" + systems.length + ")";
    app.start();
  }
  
).catch((error) => console.error("Unable to fetch data:", error));



function findSystem(system) {
  for (let i = 0; i < systems.length; i++) {
    if (systems[i].name == system) {
      return systems[i]
    }
  }
  return null
}

function duplicateWarp(s,e) {
  for (let i=0;i<warps.length;i++) {
    if (warps[i].start == e && warps[i].end == s) {
      return true;
    }
  }
  return false;
}

function resize(entries) {
  dirty = true;
  let displayWidth, displayHeight;
  for (const entry of entries) {
    let width;
    let height;
    let dpr = window.devicePixelRatio;
    if (entry.devicePixelContentBoxSize) {
      width = entry.devicePixelContentBoxSize[0].inlineSize;
      height = entry.devicePixelContentBoxSize[0].blockSize;
      dpr = 1;
    } else if (entry.contentBoxSize) {
      if (entry.contentBoxSize[0]) {
        width = entry.contentBoxSize[0].inlineSize;
        height = entry.contentBoxSize[0].blockSize;
      } else {
        width = entry.contentBoxSize.inlineSize;
        height = entry.contentBoxSize.blockSize;
      }
    } else {
      width = entry.contentRect.width;
      height = entry.contentRect.height;
    }
    displayWidth = Math.round(width * dpr);
    displayHeight = Math.round(height * dpr);
  }

  builtInScale = (displayWidth * displayHeight + 5000000 ) / 10000000;
}
const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(canvas, {box: 'content-box'});

var dragging = false;
var last_m, new_m;

function unload() {
  app.stop();
  document.removeEventListener("mousedown", mousedown);
  document.removeEventListener("mousemove", mousemove);
  document.removeEventListener("mouseup", mouseup);

  canvas.removeEventListener("wheel", mousewheel);
  document.removeEventListener("wheel", wheel);

  canvas.removeEventListener("touchstart", touchstart);
  canvas.removeEventListener("touchmove", touchmove);
  canvas.removeEventListener("touchend", touchend);

  for (let i=0;i<systems.length;i++) {
    systems[i].text.destroy(true);
    container.removeChild(systems[i].graphics);
    container.removeChild(systems[i].text);

    systems[i].graphics = null;
    systems[i].text = null;
    systems[i].name = null;
    systems[i].x = null;
    systems[i].y = null;
    systems[i].class = null;
    systems[i].spectral = null;
    systems[i].spice = null;
    systems[i].hovered = null;
    systems[i].color = null;
    systems[i].update = null;

    delete systems[i];
  }

  for (let i=0;i<warps.length;i++) {
    container.removeChild(warps[i].graphics);

    warps[i].graphics = null;
    warps[i].start = null;
    warps[i].end = null;
    warps[i].update = null;

    delete warps[i];
  }

  for (let i=0;i<largeLabels.length;i++) {
    container.removeChild(largeLabels[i]);
    largeLabels[i].destroy(true);

    largeLabels[i] = null;
  }

  for (let i=0;i<smallLabels.length;i++) {
    container.removeChild(smallLabels[i]);
    smallLabels[i].destroy(true);

    smallLabels[i] = null;
  }

  systems = null;
  warps = null;
  largeLabels = null;
  smallLabels = null;

  container.removeChildren();
  app.stage.removeChild(container);
  container.destroy(true);
  container = null;

  app.destroy(true);
  
  app = null

  canvas = null;

  PIXI = null;
  
  document.documentElement.innerHTML = '';
}
window.addEventListener('beforeunload', unload);

var mousedown = (e)=>{
  dragging = e.button == 2;

  if (dragging) {
    last_m = MousePos(e);
    canvas.style.cursor = "move";
  }
}
document.addEventListener("mousedown",mousedown)

var mousemove = (e)=>{
  if (dragging) {
    new_m = MousePos(e);

    posX += (last_m.x - new_m.x);
    posY += (last_m.y - new_m.y);

    last_m = {x: new_m.x, y: new_m.y};

    dirty = true;
  }
}
document.addEventListener("mousemove",mousemove)


var mouseup = (e)=>{
  if (dragging) {
    dragging = false;

    canvas.style.cursor = "default";
  }
}
document.addEventListener("mouseup", mouseup)

var wheel = (e)=>{
  if(e.ctrlKey) {
    if(e.preventDefault) e.preventDefault();

    return false;
  }
}

document.addEventListener("wheel", wheel, {passive:false})

var mousewheel = (e)=>{
  let m = mapPosition(e.offsetX,e.offsetY);

  let direction = e.deltaY > 0 ? 1 : -1;
  scale -= 0.08 * direction * scale;

  let p = getPosition(m.x,m.y);

  posX += p.x - e.offsetX;
  posY += p.y - e.offsetY;

  dirty = true;
}
canvas.addEventListener("wheel", mousewheel, {passive:false})

var lasttouch;
var touchstart = (e)=>{
  if (e.touches.length == 1) {
    dragging = true;

    last_m = TouchPos(e.touches[0]);
  } else {
    dragging = false;

    if (e.touches.length == 2) {
      lasttouch = {x: (TouchPos(e.touches[0]).x + TouchPos(e.touches[1]).x) / 2, y: (TouchPos(e.touches[0]).y + TouchPos(e.touches[1]).y) / 2, distance: Math.sqrt(Math.pow(TouchPos(e.touches[0]).x - TouchPos(e.touches[1]).x, 2) + Math.pow(TouchPos(e.touches[0]).y - TouchPos(e.touches[1]).y, 2))};
    }
  }
}
canvas.addEventListener("touchstart", touchstart, {passive:true})


var touchmove = (e)=>{
  if (e.touches.length == 1 && dragging) {
    new_m = TouchPos(e.touches[0]);

    posX += (last_m.x - new_m.x);
    posY += (last_m.y - new_m.y);
    
    last_m = new_m;

    dirty = true;
  } else if (e.touches.length == 2) {
    let m = mapPosition((TouchPos(e.touches[0]).x+TouchPos(e.touches[1]).x) / 2,(TouchPos(e.touches[0]).y+TouchPos(e.touches[1]).y) / 2);

    scale *= Math.sqrt(Math.pow(TouchPos(e.touches[0]).x-TouchPos(e.touches[1]).x, 2) + Math.pow(TouchPos(e.touches[0]).y-TouchPos(e.touches[1]).y, 2)) / lasttouch.distance;

    lasttouch = {x: (TouchPos(e.touches[0]).x + TouchPos(e.touches[1]).x) / 2, y: (TouchPos(e.touches[0]).y + TouchPos(e.touches[1]).y) / 2, distance: Math.sqrt(Math.pow(TouchPos(e.touches[0]).x - TouchPos(e.touches[1]).x, 2) + Math.pow(TouchPos(e.touches[0]).y - TouchPos(e.touches[1]).y, 2))};

    let p = getPosition(m.x,m.y);

    posX += p.x - (TouchPos(e.touches[0]).x + TouchPos(e.touches[1]).x) / 2;
    posY += p.y - (TouchPos(e.touches[0]).y + TouchPos(e.touches[1]).y) / 2;

    dirty = true;
  }
}

canvas.addEventListener("touchmove", touchmove, {passive:true});

var touchend = (e)=>{
  dragging = false;

  if (e.touches.length == 1) {
    dragging = true;

    last_m = TouchPos(e.touches[0]);
  }
}

canvas.addEventListener("touchend", touchend, {passive:true});

function MousePos(e) {
  return {
    x: e.clientX,
    y: e.clientY
  }
}


function TouchPos(touch) {
  return {
    x: touch.clientX,
    y: touch.clientY,
  }
}

