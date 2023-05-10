class DateClass {
    //获取当前时间
    formatTime(date = new Date(), split = "-", time = "d") {
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()

        const type = time.toLowerCase()
        const str = [year, month, day].map(this.formatNumber).join(split ? split : '/') + ' ' + [hour, minute,
            second
        ].map(this.formatNumber).join(':');
        if (type) {
            switch (type) {
                case 'y':
                    return year
                case 'm':
                    return [year, month].map(this.formatNumber).join(split ? split : '/')
                case 'd':
                    return [year, month, day].map(this.formatNumber).join(split ? split : '/')
                default:
                    return str
            }
        } else {
            return str
        }
    }

    formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
    }

    calcWeek(d) { //推几天

        const date = new Date()

        date.setDate(date.getDate() - d)

        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()

        return [year, month, day].map(this.formatNumber).join('-')
    }

    calcMonth(m) { //推几个月
        const date = new Date()
        const curDay = date.getDate()

        date.setMonth(date.getMonth() - m)

        const year = date.getFullYear()
        let month = date.getMonth()
        let day = date.getDate()

        if (curDay === day) {
            month = month + 1
        } else {
            day = new Date(year, month, 0).getDate()
        }

        return [year, month, day].map(this.formatNumber).join('-')
    }

    //将时间戳转换成日期格式
    timestampToTime(timestamp) {
        // if (!timestamp) return
        // if (timestamp.length === 10) {
        //     timestamp = timestamp * 1000
        // }
        // const date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        // let Y = date.getFullYear()
        // let M = date.getMonth() + 1
        // let D = date.getDate()
        // let h = date.getHours()
        // let m = date.getMinutes()
        // let s = date.getSeconds()
        // return [Y, M, D].map(this.formatNumber).join('-')
        timestamp = timestamp ? timestamp : null;
        let date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + "-";
        let M =
            (date.getMonth() + 1 < 10
            ? "0" + (date.getMonth() + 1)
            : date.getMonth() + 1) + "-";
        let D =
            (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
        let h =
            (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
        let m =
            (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
            ":";
        let s =
            date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
    }

    // 3为昨天 , 6为今天 , 9为明天, 1当月第一天， 2当月最后一天, 4上月第一天， 5上月最后一天， 7今年第一天， 8今年最后一天
    dealTime(v) {
        let b = 24 * 60 * 60 * 1000 //一天的时间
        let day = new Date(); //当天的时间

        v == 3 ? day.setTime(day.getTime() - b) :
            v == 6 ? day.setTime(day.getTime()) :
                v == 9 ? day.setTime(day.getTime() + b) :
                    v == 1 ? day.setDate(1) :
                        v == 2 ? day.setMonth(day.getMonth() + 1) & day.setDate(0) :
                            v == 4 ? day.setMonth(day.getMonth() - 1) & day.setDate(1) :
                                v == 5 ? day.setDate(0) :
                                    v == 7 ? day.setMonth(0) & day.setDate(1) :
                                        v == 8 ? day.setFullYear(day.getFullYear() + 1) & day.setMonth(0) & day.setDate(0) :
                                            '';

        let dayMon = (day.getMonth() + 1) >= 10 ? day.getMonth() + 1 : '0' + (day.getMonth() + 1)
        let dayDat = (day.getDate() + 1) >= 10 ? day.getDate() : '0' + (day.getDate())

        let s = day.getFullYear() + "-" + dayMon + "-" + dayDat;
        return s
    }
}

export default new DateClass()
