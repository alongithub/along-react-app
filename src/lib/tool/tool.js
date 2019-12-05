const tool = {
    trim:function (str){ //删除左右两端的空格
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },
    toDou:function (n) {
        return n>=10?n:`0${n}`
    },
    //判断身份证号正则
    isCardID: function (cardID) {
        const reg=/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
        return reg.test(cardID)
    },
     //判断手机号正则
     isPhoneNumber: function (phoneNumber) {
        const reg=/^1[3|4|5|7|8][0-9]{9}$/;
        return reg.test(phoneNumber)
    },
    //取登录cookie
    getCookie:function (name) {
        let cookieArr = '';
        if (typeof document !== 'undefined') {
            cookieArr = document.cookie.split('; ');
        }
        for (let i = 0; i < cookieArr.length; i++) {
            let cookieArr2 = cookieArr[i].split('=');
            if (cookieArr2[0] === name) {
                return cookieArr2[1]
            }
        }
        return ''
    },
}

export default tool;