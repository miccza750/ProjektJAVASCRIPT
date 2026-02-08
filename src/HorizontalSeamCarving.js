function findHorizontalSeam(energy) {
  const h = energy.length;
  const w = energy[0].length;

  const dp = Array.from({ length: h }, () => Array(w).fill(Infinity));
  const parent = Array.from({ length: h }, () => Array(w).fill(-1));

  for (let y = 0; y < h; y++) {
    dp[y][0] = energy[y][0];
  }

    for (let x = 1; x < w; x++) {
          for (let y = 0; y < h; y++) {
      let minY = y;
      let minVal = dp[y][x-1];

      if (y>0&&dp[y - 1][x - 1] < minVal) {
        minVal = dp[y - 1][x - 1];
        minY = y - 1;
      }
      if (y < h-1 && dp[y + 1][x - 1] < minVal) {
        minVal = dp[y + 1][x - 1];
        minY = y + 1;
      }

      dp[y][x] = energy[y][x] + minVal;
      parent[y][x] = minY;
    }
  }

  let minY = 0;
for (let y = 1; y < h; y++) {
  if (dp[y][w-1] < dp[minY][w-1]) minY = y;
}

  const seam = Array(w);
  let y = minY;
  for (let x = w - 1; x >= 0; x--) {
    seam[x] = y;
    y = parent[y][x];
  }

  return seam;
}
function drawHorizontalSeam(seam) {
  ctx.strokeStyle = "red";
  ctx.lineWidth = 4;
  ctx.beginPath();

  seam.forEach((x, y) => {
    if (x === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();
}
function removeHorizontalSeam(imageData, seam, w, h) {
  const newData = new ImageData(w, h - 1);
  const src = imageData.data;
  const dst = newData.data;
    for (let x = 0; x < w; x++) {
      let ny = 0;
      for (let y = 0; y < h; y++) {
      if (y !== seam[x]) {
        const si = (y * w + x) * 4;     
        const di = (ny * w + x) * 4;    
        dst[di]     = src[si];
        dst[di + 1] = src[si + 1];
        dst[di + 2] = src[si + 2];
        dst[di + 3] = src[si + 3];
        ny++;
      }
    }
  }

  return newData;
}