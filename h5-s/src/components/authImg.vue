<template>
  <img ref="img"> </img>
</template>
<script>
import { getToken} from '@/utils/auth'
export default {
  name: "authImg",
  props: {
    authSrc: {
      type: String,
      required: false,
      default: "",
    },
  },
  mounted() {
  //这是区分开发环境和生产环境,视情况而定
  // this.authSrc = process.env.VUE_APP_BASE_API + "/image/preview?fileName=" + this.authSrc;

    Object.defineProperty(Image.prototype, "authsrc", {
      writable: true,
      enumerable: true,
      configurable: true,
    });
    
    let img = this.$refs.img;
    let request = new XMLHttpRequest();
    // let token = 'eyJhbGciOiJIUzUxMiJ9.eyJpc0ZpcnN0TG9naW4iOmZhbHNlLCJsb2dpbl91c2VyX2tleSI6IjE5MGRjYjczLThlM2MtNDY2ZS04OWIzLTg3ZjcwNTdkYTgzZCJ9.Fh-m2tVT7MYa5lUj38z_CVEsbxkt36YBhoQQrfBSMVzL4CVjBlvLjJC9yRQXwv-aN4xWzUPpAGqmVj-2jkOBmA'
    request.responseType = "blob";
    // console.log(this.authSrc,'authimg');
    request.open("get", this.authSrc, true);
    //这里带上请求头
    const token = getToken();
    request.setRequestHeader("Authorization", token);
    request.onreadystatechange = (e) => {
      if (request.readyState == XMLHttpRequest.DONE && request.status == 200) {
        // img.src = URL.createObjectURL(request.response);
        // console.log(img.src,'img.src');
        // img.onload = () => {
        //   URL.revokeObjectURL(img.src);
        // };
        const oFileReader = new FileReader()
        oFileReader.readAsDataURL(request.response);
        oFileReader.onloadend = function(e) {
          const base64 = e.target.result
          img.src = base64
          // console.log(base64,'img.src');
        }
        
      }
    };
    request.send(null);
  },
};
</script>
