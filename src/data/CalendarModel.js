import ObservableModel from "./ObservableModel";
import { BASE_URL, httpOptions, firebaseConfig } from "./apiConfig";
import { monthNames, monthLengths } from "./const.js"

class CalendarModel extends ObservableModel {
    constructor() {
        super();

        this.date = new Date();

        this.year = this.date.getFullYear(),
        this.monthNumber = this.date.getMonth();

        this.status = monthLengths[this.monthNumber];

        this.day = this.date.getDate();
        this.mode = "monthly";
        
        this.detailsEntry=null;
        this.detailsDay=null;

        this.monthDays;
    }

    resetStatus(){
        this.status = monthLengths[this.monthNumber];
    }

    leapYearFeb(){
        if(this.year%4===0 && this.monthNumber===1)
            return true
        else return false;
    }

    changeMonth(direction) {
        let monthNumber;
        if (direction === "right") {
            monthNumber = this.monthNumber + 1;
            if (monthNumber > 11) {
                monthNumber = 0;
                this.year++;
            }
        }
        else {
            monthNumber = this.monthNumber - 1;
            if (monthNumber < 0) {
                monthNumber = 11;
                this.year--
            }
        }

        this.monthNumber = monthNumber;
        this.status = monthLengths[this.monthNumber];

        this.notifyObservers({ type: "new-month" });
    }

    getMonth() {
        return this.monthNumber;
    }

    getMonthName() {
        return monthNames[this.monthNumber];
    }

    getYear(){
        return this.year;
    }

    getDateTemp(idx) {
        if (idx !== undefined)
            return this.year + "-" + (this.monthNumber + 1).toString().padStart(2, '0') + "-" + (idx).toString().padStart(2, '0');
        else
            return null;
    }

    getDaysArray() {
        let monthLength;

        if(this.leapYearFeb()===true)
            monthLength=monthLengths[this.monthNumber]+1;
        else
            monthLength=monthLengths[this.monthNumber];

        this.monthDays=new Array(monthLength);

        for (let i = 0; i < monthLength; i++)
            this.monthDays[i] = (i + 1);

        return this.monthDays;
    }

    setStatus() {
        this.status--;
    }

    getStatus() {
        return this.status;
    }

    setDetails(entry,day){
        this.detailsDay=day;
        this.detailsEntry=entry;
    }

    getDetails(){
        return {day:this.detailsDay,entry:this.detailsEntry};
    }
}

const calendarInstance = new CalendarModel();
export default calendarInstance;
