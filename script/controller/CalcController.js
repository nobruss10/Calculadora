class CalcController {
    constructor() {
        this._displayCal = "0";
        this._currentDate;
        this.initialize();
    }

    initialize(){
        let displayCalEl  = document.querySelector("#display");
        let dateEl = document.querySelector("#data");
        let timeEl = document.querySelector("#hora")

        displayCalEl.innerHTML =  "12345";
        dateEl.innerHTML = "29/01/2019";
        timeEl.innerHTML = "00:00";
    }

    get displayCal(){
        return _displayCal;
    }

    set displayCal(value){
        _displayCal = value;
    }

    get dataAtual(){
        return this._currentDate;
    }

    set dataAtual(value){
        this._currentDate = value;
    }
}