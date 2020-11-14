export default function dataURLtoFile(dataurl, filename) {
  console.log("Inside dataURLtoFile")
  let arr = dataurl.split(',');
  let mime = arr[0].match(/:(.*?);/)[1];
  let bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);

  console.log("BEFORE WHILE")
  while(n--){
    u8arr[n] = bstr.charCodeAt(n);
  }
  console.log("AFTER WHILE")

  return new File([u8arr], filename, {type:mime});
}