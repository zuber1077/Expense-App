//BUDGET CONTROLLER
var budgetController = (function () {
    
    var Expense = function(id, description , value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

})(); 




//UI CONTROLLER
var UIcontroller = (function () {

    var DOMstrings = {
         inputType: '.add__type', 
         inputDescription: '.add__description',
         inputValue:'.add__value',
         inputButton: '.add__btn'
        };

        return {
            getInput: function () {
                return { 
                type: document.querySelector(DOMstrings.inputType).value, //will be either or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value:document.querySelector(DOMstrings.inputValue).value 
            }; 
            },
            getDOMstrings: function () {
                return DOMstrings;
            }
        };
})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListener  = function(){
        var DOM =  UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();


                }
         });
    };



    var ctrlAddItem = function() {
            //1. get the filled input data
                var input =  UICtrl.getInput();
            //2. add the item to the budget conteoller

             //3. add the item to the UI

             //4. ca;culate the budget

            //5. display the budget on the UI
                                    
        };

        return{
            init: function(){
                console.log('app has Ster');
                setupEventListener();
            }
        };

    })(budgetController, UIcontroller);

controller.init();