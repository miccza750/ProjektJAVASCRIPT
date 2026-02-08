const pobierzbutton = document.getElementById("pobierzbutton");
const canvasdown = document.getElementById("canvas");
pobierzbutton.addEventListener("click", () => {
  const url = canvasdown.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = "seam-carved.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});