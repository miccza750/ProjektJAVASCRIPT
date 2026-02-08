
function energyMap(imageData, w, h) {
  const d = imageData.data;
  const energy = Array.from({ length: h }, () => Array(w).fill(0));

  const sobelX = [-1,0,1,-2,0,2,-1,0,1];
  const sobelY = [-1,-2,-1,0,0,0,1,2,1];

  const idx = (x, y) => (y * w + x) * 4;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      let gx = 0, gy = 0;
      let k = 0;

      for (let j = -1; j <= 1; j++) {
        for (let i = -1; i <= 1; i++) {
          const ii = idx(x + i, y + j);
          const gray = 0.299*d[ii] + 0.587*d[ii+1] + 0.114*d[ii+2];
          gx += gray * sobelX[k];
          gy += gray * sobelY[k];
          k++;
        }
      }
      energy[y][x] = Math.sqrt(gx*gx + gy*gy);
    }
  }
  return energy;
}

function findVerticalSeam(energy) {
  const h = energy.length;
  const w = energy[0].length;

  const dp = Array.from({ length: h }, () => Array(w).fill(Infinity));
  const parent = Array.from({ length: h }, () => Array(w).fill(-1));

  for (let x = 1; x < w - 1; x++) {
    dp[0][x] = energy[0][x];
  }

  for (let y = 1; y < h; y++) {
    for (let x = 1; x < w - 1; x++) {
      let minX = x;
      let minVal = dp[y - 1][x];

      if (dp[y - 1][x - 1] < minVal) {
        minVal = dp[y - 1][x - 1];
        minX = x - 1;
      }
      if (dp[y - 1][x + 1] < minVal) {
        minVal = dp[y - 1][x + 1];
        minX = x + 1;
      }

      dp[y][x] = energy[y][x] + minVal;
      parent[y][x] = minX;
    }
  }

  let minX = 1;
  for (let x = 2; x < w - 1; x++) {
    if (dp[h - 1][x] < dp[h - 1][minX]) {
      minX = x;
    }
  }

  const seam = Array(h);
  let x = minX;

  for (let y = h - 1; y >= 0; y--) {
    seam[y] = x;
    x = parent[y][x];
  }

  return seam;
}

function drawSeam(seam) {
  ctx.strokeStyle = "red";
  ctx.lineWidth = 4;
  ctx.beginPath();

  seam.forEach((x, y) => {
    if (y === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}
function removeVerticalSeam(imageData, seam, w, h) {
  const newData = new ImageData(w - 1, h);
  const src = imageData.data;
  const dst = newData.data;

  for (let y = 0; y < h; y++) {
    let nx = 0;
    for (let x = 0; x < w; x++) {
      if (x !== seam[y]) {
        const si = (y * w + x) * 4;
        const di = (y * (w - 1) + nx) * 4;
        dst[di]     = src[si];
        dst[di + 1] = src[si + 1];
        dst[di + 2] = src[si + 2];
        dst[di + 3] = src[si + 3];
        nx++;
      }
    }
  }

  return newData;
}
function removeMultipleSeams(ctx, canvas, count, delay = 30) {
  if (count <= 0){ 
  document.getElementById("removeSeam").disabled = false;
    return;
  }
  const w = canvas.width;
  const h = canvas.height;

  const imgData = ctx.getImageData(0, 0, w, h);
  const energy = energyMap(imgData, w, h);
  const seam = findVerticalSeam(energy, w, h);

  ctx.putImageData(imgData, 0, 0);
  drawSeam(seam);
  drawPreview();

  setTimeout(() => {
    const newData = removeVerticalSeam(imgData, seam, w, h);
    canvas.width = w - 1;
    ctx.putImageData(newData, 0, 0);
    console.log(pokazowycanvas.width);
      drawPreview();
removeMultipleSeams(ctx, canvas, count - 1, delay);

  }, delay);
}
document.getElementById("removeSeam").onclick = () => {
  document.getElementById("removeSeam").disabled = true;
  removeMultipleSeams(ctx, canvas,Math.round((100-widthRange.value)/100*canvas.width));

};