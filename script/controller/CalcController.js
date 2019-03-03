class CalcController {
    constructor() {
        this._audio = new Audio('click.mp3');
        this._audioOnOff =  false;
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
        this._locale = "pt_BR";
        this._displayCalEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora")
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyboard();
    }

    initialize() {
        this.setDisplayDateTime();

        setInterval(() => {
            this.setDisplayDateTime()
        }, 1000);

        this.setLastNumberToDisplay()
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn => {
            btn.addEventListener('dblclick', e => {
                this.toogleAudio();
            })
        })
    }

    toogleAudio() {
        this._audioOnOff = !this._audioOnOff 
    }

    playAudio() {
        if (this._audioOnOff) {
            this._audio.currentTime = 0;
            this._audio.play();
        }
    }

    copyToClipboard() {
        let input = document.createElement('input');
        input.value = this.displayCal;
        document.body.appendChild(input);
        input.remove();
    }

    pasteFromClipboard() {
        document.addEventListener('paste', e =>{
            let text = e.clipboardData.getData('Text');
            this.displayCal = parseFloat(text);
        });
    }

    initKeyboard() {
        document.addEventListener('keyup', e =>{
            this.playAudio();

            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;
                case '':
                    this.clearEntry();
                    break;
                case '+':
                    this.addOperation('+');
                    break;
                case '-':
                this.addOperation('-');
                    break;
                case '/':
                    this.addOperation('/');
                    break;
                case '*':
                    this.addOperation('*');
                    break;
                case '%':
                    this.addOperation('%');
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case 'ponto':
                case ',':
                    this.addDot();
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if (e.ctrlKey) this.copyToClipboard();
                    break;
                case 'v':
                    if(e.ctrlKey) this.pasteFromClipboard();
                    break;
            }
           
        });
    }

    addEventListenerAll(element, events, fn) {
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        })

    }

    execBtn(value) {
        this.playAudio();

        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
            this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot();
                break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseFloat(value));
                break;
            default:
                this.setErro();
                break;

        }
    }

    addDot() {
        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1 ) return ;

        if (this.isOperator(lastOperation) || !lastOperation) {
            this.pushOperation('0.');

        } else {
            this.setLastOperation(lastOperation.toString() + '.');
        }

        this.setLastNumberToDisplay();
    }

    clearAll() {
        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();
    }

    clearEntry() {
        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    setErro() {
        this.displayCal = "Error";
    }

    addOperation(value) {

        if (isNaN(this.getLastOperation())) {
            
            if (this.isOperator(value)) {
                this.setLastOperation(value);
            } else if(isNaN(value)) {
               console.log('valor', value);
            } else {
                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }

        } else {
            if (isNaN(value)) {
                this.pushOperation(value);
            } else {
                let newValue = this.getLastOperation() + value.toString();
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();
            }
        }
        console.log(this._operation);
    }

    isOperator(value) {
        return ( ['+', '-', '*', '/', '%'].indexOf(value) > -1 );
    }

    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

    pushOperation(value){
        this._operation.push(value)
        if(this._operation.length > 3) {
            this.calc();
        }
    }

    getResult() {
        try {
            return eval(this._operation.join(""));
        } catch (e) {
            setTimeout(() => {
                this.setErro()
            }, 1);
        }
    }
    
    calc() {
        
        let last = '';
        
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3) {
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
        }

        if(this._operation.length > 3) {
            last = this._operation.pop();
            this._lastNumber = this.getResult();

        } else if (this._operation.length == 3) {
            this._lastNumber = this.getLastItem(false);
        }

        let result = this.getResult();

        if(last == '%') { 
            result /= 100;
            this._operation = [result];
        } else {   
            this._operation =  [result];
            if(last) this._operation.push(last);
        }
        this.setLastNumberToDisplay();
    }
    
    getLastItem(isOperator = true) {
        let lastItem;

         for (let i = this._operation.length -1; i >= 0; i --) {
            if(this.isOperator(this._operation[i]) == isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }
        
        if(!lastItem) {
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
        }

        return lastItem;
    }

    setLastNumberToDisplay() {
        let lastNumber = this.getLastItem(false);
        if (!lastNumber) lastNumber = 0;
        this.displayCal = lastNumber;
    }

    initButtonsEvents() {
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");

        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, 'click drag', e => {
                let textBtn = btn.className.baseVal.replace('btn-', '');
                this.execBtn(textBtn);
            });
            this.addEventListenerAll(btn, 'mouseover mouseup mousedown', e => {
                btn.style.cursor = "pointer"
            });
        })
    }

    setDisplayDateTime() {
        this.displayDate = this.currentDate.toLocaleDateString(this._Locale, {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._Locale);
    }

    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    get displayCal() {
        return this._displayCalEl.innerHTML;
    }

    set displayCal(value) {
        if(value.toString().length > 10 ) {
            this.setErro();
            return false;
        }

        this._displayCalEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }
}