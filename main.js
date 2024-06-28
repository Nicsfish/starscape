(function() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  let systems = [];
  let warps = [];

  var scale = 1;
  var builtInScale = 2;
  var posX = 0;
  var posY = 0;

  var map = [];

  fetch("./data/map.json")
    .then((res) => {
        if (!res.ok) {
            throw new Error
                (`Status: ${res.status}`);
        }
        return res.json();
    })
    .then((data) => {
      map = data;
      for (let i = 0; i < data.length; i++) {
        console.log(data[i]);

        let system = {};

        system.name = data[i].name;
        system.x = data[i].x;
        system.y = data[i].y;
        system.class = data[i]["security class"];
        system.draw = function(){
            ctx.save();
            if (system.class == "Core") ctx.fillStyle = "rgb(32, 203, 32)";
            if (system.class == "Secure") ctx.fillStyle = "rgb(33, 124, 203)";
            ctx.beginPath();
            ctx.arc(getPosition(system.x,system.y)[0],getPosition(system.x,system.y)[1],5*scale*builtInScale,0,2*Math.PI);
            ctx.fill();
            
            ctx.fillStyle = "#FFF";
            ctx.textAlign = "center";
            ctx.font = (12 * scale * builtInScale).toString() + "px \"Consolas\", monospace";
            ctx.fillText(system.name, getPosition(system.x,system.y-20)[0],getPosition(system.x,system.y-20)[1]);

            ctx.restore();
        }
        systems.push(system)
      }
      for (let i = 0; i < data.length; i++) {
        for (let j=0;j<data[i].warp.length;j++) {
          let warp = {};

          warp.start = findSystem(data[i].name);
          warp.end = findSystem(data[i].warp[j]);

          console.log(warp)
          warp.draw = function(){
            ctx.save();

            
            ctx.translate(
              getPosition(warp.start.x,warp.start.y)[0],getPosition(warp.start.x,warp.start.y)[1]
            );
            
            ctx.rotate(Math.atan2((getPosition(warp.end.x,warp.end.y)[1]-getPosition(warp.start.x,warp.start.y)[1]),(getPosition(warp.end.x,warp.end.y)[0]-getPosition(warp.start.x,warp.start.y)[0])));
            

            const grad=ctx.createLinearGradient(
              0,0,
              Math.sqrt(Math.pow(getPosition(warp.start.x,warp.start.y)[0]-getPosition(warp.end.x,warp.end.y)[0], 2) + Math.pow((getPosition(warp.start.x,warp.start.y)[1]-getPosition(warp.end.x,warp.end.y)[1]), 2)),
              0
            );

            if (warp.start["security class"] == "Core") {
              grad.addColorStop(0, "rgba(32, 203, 32, 0.2)");
              grad.addColorStop(1, "rgba(32, 203, 32, 0)");

              ctx.fillStyle = grad;
            }
            if (warp.start["security class"] == "Secure") {
              grad.addColorStop(0, "rgba(33, 124, 203, 0.2)");
              grad.addColorStop(1, "rgba(33, 124, 203, 0)");

              ctx.fillStyle = grad;
            }
            
            ctx.fillRect(
              0,-2*scale*builtInScale,
              Math.sqrt(Math.pow(getPosition(warp.start.x,warp.start.y)[0]-getPosition(warp.end.x,warp.end.y)[0], 2) + Math.pow((getPosition(warp.start.x,warp.start.y)[1]-getPosition(warp.end.x,warp.end.y)[1]), 2)),
              4*scale*builtInScale
            );

            ctx.restore();

          }
          warps.push(warp)
        }
      }
      for(let i = 0; i < warps.length; i++){warps[i].draw()}
      for(let i = 0; i < systems.length; i++){systems[i].draw()}
      console.log(data)
    }
  ).catch((error) => 
    console.error("Unable to fetch data:", error));

  function findSystem(system) {
    for (let i = 0; i < map.length; i++) {
      if (map[i].name == system) {
        return map[i]
      }
    }
    return null
  }

  function getPosition(x,y) {
    return [x*scale*builtInScale+canvas.width/2 - posX, -y*scale*builtInScale+canvas.height/2 - posY]
  }

  function onResize(entries) {
    for (const entry of entries) {
      let width;
      let height;
      let dpr = window.devicePixelRatio;
      if (entry.devicePixelContentBoxSize) {
        // NOTE: Only this path gives the correct answer
        // The other 2 paths are an imperfect fallback
        // for browsers that don't provide anyway to do this
        width = entry.devicePixelContentBoxSize[0].inlineSize;
        height = entry.devicePixelContentBoxSize[0].blockSize;
        dpr = 1; // it's already in width and height
      } else if (entry.contentBoxSize) {
        if (entry.contentBoxSize[0]) {
          width = entry.contentBoxSize[0].inlineSize;
          height = entry.contentBoxSize[0].blockSize;
        } else {
          // legacy
          width = entry.contentBoxSize.inlineSize;
          height = entry.contentBoxSize.blockSize;
        }
      } else {
        // legacy
        width = entry.contentRect.width;
        height = entry.contentRect.height;
      }
      const displayWidth = Math.round(width * dpr);
      const displayHeight = Math.round(height * dpr);

      canvas.width = displayWidth;
      canvas.height = displayHeight;
    }
    for(let i = 0; i < warps.length; i++){warps[i].draw()}
    for(let i = 0; i < systems.length; i++){systems[i].draw()}
  }

  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(canvas, {box: 'content-box'});

})();