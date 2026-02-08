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