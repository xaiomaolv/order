import pictureCompress from "picture-compressor-plus";
import { getToken} from '@/utils/auth'
/**
*图片压缩工具类
*最大高度和最大宽度都为 500， 如果超出大小将等比例缩放。 *
*注意可能出现压缩后比原图更大的情况， 在调用的地方自己判断大小并决定上传压缩前或压缩后的图到服务器。 *
*/
// 将base64转换为blob
export function convertBase64UrlToBlob(urlData) {
  let arr = urlData.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], {
    type: mime
  })
}
//将blob转换为file
export function blobToFile(theBlob){
    theBlob.lastModifiedDate = new Date();
    return theBlob;
 }
// 压缩图片
export function compressImage(path) {
    //最大高度
    const maxHeight = 800;
    //最大宽度
    const maxWidth = 1000;
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.src = path;
        img.onload = function () {
            const originHeight = img.height;
            const originWidth = img.width;
            let compressedWidth = img.height;
            let compressedHeight = img.width;
            if ((originWidth > maxWidth) && (originHeight > maxHeight)) {
                // 更宽更高，
                if ((originHeight / originWidth) > (maxHeight / maxWidth)) {
                    // 更加严重的高窄型，确定最大高，压缩宽度
                    compressedHeight = maxHeight
                    compressedWidth = maxHeight * (originWidth / originHeight)
                } else {
                    //更加严重的矮宽型, 确定最大宽，压缩高度
                    compressedWidth = maxWidth
                    compressedHeight = maxWidth * (originHeight / originWidth)
                }
            } else if (originWidth > maxWidth && originHeight <= maxHeight) {
                // 更宽，但比较矮，以maxWidth作为基准
                compressedWidth = maxWidth
                compressedHeight = maxWidth * (originHeight / originWidth)
            } else if (originWidth <= maxWidth && originHeight > maxHeight) {
                // 比较窄，但很高，取maxHight为基准
                compressedHeight = maxHeight
                compressedWidth = maxHeight * (originWidth / originHeight)
            } else {
                // 符合宽高限制，不做压缩
            }
            // 生成canvas
            let canvas = document.createElement('canvas');
            let context = canvas.getContext('2d');
            canvas.height = compressedHeight;
            canvas.width = compressedWidth;
            context.clearRect(0, 0, compressedWidth, compressedHeight);
            context.drawImage(img, 0, 0, compressedWidth, compressedHeight);
            let base64 = canvas.toDataURL('image/*');
            let blob = convertBase64UrlToBlob(base64);
            // 回调函数返回blob的值。也可根据自己的需求返回base64的值
            resolve(blob)
        }
    })
}

// 压缩图片
export function img_compress(file) {
    return new Promise((resolve, reject) => {
        var that = this;
        var files = file.file;
        var reads = new FileReader();
        reads.readAsDataURL(files);
        reads.onload = function () {
            pictureCompress({
                img: this.result,
                width: 500,
                height: 600,
                fit: "fill",
            }).then((res) => {
                var img = new Image();
                img.src = res.img;
                let blob = convertBase64UrlToBlob(img.src);
                var filed = blobToFile(blob);
                const formData = new FormData();
                formData.append("file", filed, file.file.name);
                console.log(formData);

                resolve (formData)
            });
        };
    })
}

//图片携带token预览
export function requestImage (authSrc) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        let request = new XMLHttpRequest();
        // let token = 'eyJhbGciOiJIUzUxMiJ9.eyJpc0ZpcnN0TG9naW4iOmZhbHNlLCJsb2dpbl91c2VyX2tleSI6IjE5MGRjYjczLThlM2MtNDY2ZS04OWIzLTg3ZjcwNTdkYTgzZCJ9.Fh-m2tVT7MYa5lUj38z_CVEsbxkt36YBhoQQrfBSMVzL4CVjBlvLjJC9yRQXwv-aN4xWzUPpAGqmVj-2jkOBmA'
        request.responseType = "blob";
        // console.log(authSrc,'authimg');
        request.open("get", authSrc, true);
        //这里带上请求头
        const token = getToken();
        request.setRequestHeader("Authorization", token);
        request.onreadystatechange = (e) => {
        if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
            const oFileReader = new FileReader()
            oFileReader.readAsDataURL(request.response);
            oFileReader.onloadend = function(e) {
                const base64 = e.target.result
                // img.src = base64
                // console.log(base64,'img.src');
                resolve(base64)
            }
        }
        };
        request.send(null);
    })
    
    
}