class CalcController {
    constructor() {
        this._displayCal = "0";
        this._dataAtual;
    }

    get displayCal(){
        return _displayCal;
    }

    set displayCal(valor){
        _displayCal = valor;
    }

    get dataAtual(){
        return this._dataAtual;
    }

    set dataAtual(valor){
        this._dataAtual = valor;
    }
}