//BUDGET CONTROLLER
var budgetController = (function () {
    
    var Expense = function(id, description , value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcualtePercentages = function(totalIncome){

        if(totalIncome > 0){
        this.percentage = Math.round((this.value / totalIncome) * 100);

        }else{
            this.percentage = -1;
        }
    };

    Expense.prototype.getpercentage = function(){
        return this.percentage;
    };

    var Income = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        data.totals[type] = sum;
        /*  
        0
        [200, 400, 100]
        sum = 0 + 200
        sum = 200 + 400
        sum = 600 + 700
        */
    };


    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, des , val){
            var newItem, ID;
            //[1 2 3 4 5], next ID = 6
            //[1 2 4 6 8], next ID = 6
            //ID = last ID + 1  

            //create new id
            if(data.allItems[type].length > 0){
            ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }else{
                ID = 0;
            }

            // creat new item based on 'inc' or 'exp' type
            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            }else if(type === 'inc'){
                newItem = new Income(ID , des ,val)
            }
            //push it into our data stracture
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;
        },
        deleteItem: function(type, ID){
            var ids, index;
            //id = 6
            // data.allItems[type][id];
            // ids = [1 2 4  8]
            //index = 3 

            ids = data.allItems[type].map(function(current){
                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1)
            }
        },

        calculateBudget: function(){

            //calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            //calculate the budget: income - expreses
            data.budget = data.totals.inc - data.totals.exp;
            //calcualte the paecentages of income taht we spent
            if(data.totals.inc > 0){
                data.percentage = Math.round(data.totals.exp / data.totals.inc * 100);
            }else{
                data.percentage = -1;
            }


            //Expense = 100 income 300, spent 33.333% = 100/300 = 0.3333 * 100 
        },

        calcualtePercentages: function(){
            /*
            a=20
            b=10
            c=40
            income = 180
            a=20/100=20%
            b=10/100=10%
            c=40/100=40%
             */
            data.allItems.exp.forEach(function(cur){
                cur.calcualtePercentage(data.totals.inc);
            });
        },
        

        getPercentages: function(){
            var allPerc = data.allItems.exp.map(function(cur){
                current.calcualtePercentage();
            });
            return allPerc;
        },



        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        },

        testing: function(){
            console.log(data)
        }
    };

})(); 




//UI CONTROLLER
var UIcontroller = (function () {

    var DOMstrings = {
         inputType: '.add__type', 
         inputDescription: '.add__description',
         inputValue:'.add__value',
         inputBtn: '.add__btn',
         incomeContainer: '.income__list',
         expensesContainer: '.expenses__list',
         budgetLabel: '.budget__value',
         incomeLabel: '.budget__income--value',
         expensesLabel: '.budget__expenses--value',
         percentageLabel: '.budget__expenses--percentage',
         container: '.container'
        };

        return {
            getInput: function () {
                return { 
                type: document.querySelector(DOMstrings.inputType).value, //will be either or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value) 
            }; 
            },

            addListItem: function(obj, type){
                var html, newHtml, element;
                //create HTML string with placeholder text

                if(type === 'inc'){
                    element = DOMstrings.incomeContainer;
                    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline" /></button></div></div></div>';
                }else if(type === 'exp'){
                    element = DOMstrings.expensesContainer; 
                    html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                }
            
                //Replace the placeholder text with dome actual data
                newHtml = html.replace('%id%', obj.id);
                newHtml = newHtml.replace('%description%', obj.description);
                newHtml = newHtml.replace('%value%', obj.value);
                //Insert the HTML into the DOM
                document.querySelector(element).insertAdjacentHTML('beforeend', newHtml)

            },

            deleteListItem: function(selectorID){

                var el = document.getElementById(selectorID);
                el.parentNode.removeChild(el);

            },

          clearFields: function(){
                var fields, fieldsArr;

                fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

                fieldsArr = Array.prototype.slice.call(fields);

                fieldsArr.forEach(function(current, index, array){
                    current.value = "";
                });

                fieldsArr[0].focus(); //added focus method

            },

            displayBudget: function(obj){

                document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
                document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
                document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;

                if(obj.percentage > 0){
                    document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
                }else{
                    document.querySelector(DOMstrings.percentageLabel).textContent = '---';

                }

            },

             getDOMstrings: function() { 
                return DOMstrings;
            }
        };
})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var setupEventListener  = function(){
        var DOM =  UICtrl.getDOMstrings();

        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function(event) {
            if(event.keyCode === 13 || event.which === 13){
                ctrlAddItem();


                }
         });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    };

    var updateBudget = function(){

        //1.calculate the budget
        budgetCtrl.calculateBudget();
        //2.return the budget
        var budget = budgetCtrl.getBudget();
        //3 .display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    var updatePercentages = function(){
        //1. calculate percentages
        budgetCtrl.calcualtePercentages();

        //2, read percentages from the budeget controller
        var percentages =  budgetCtrl.getPercentages();
        //3. update the UI with the new percentages
        console.log(percentages);
    };

    var ctrlAddItem = function() {
        var input , newItem;
            //1. get the filled input data

            input =  UICtrl.getInput();
            if(input.description !== "" && !isNaN(input.value) && input.value > 0 ){
            //2. add the item to the budget conteoller
            newItem =  budgetCtrl.addItem(input.type, input.description , input.value)

             //3. add the item to the UI
            UICtrl.addListItem(newItem, input.type);
             //4. clear the field
            UICtrl.clearFields();
             //5. calculate and update budget
             updateBudget();
             //6. calculate and update percentages
             updatePercentages();
            }
                                    
        };

        var ctrlDeleteItem = function(event){
            var itemID, splitID, type,ID;

            itemID = event.target.parentNode.parentNode.parentNode.id;
            if(itemID){

                //inc-1
                splitID = itemID.split('-');    
                type = splitID[0];
                ID = parseInt(splitID[1]);

                //1.delete the item from the data structure
                budgetCtrl.deleteItem(type, ID);
                //2.delete the item from the UI
                UICtrl.deleteListItem(itemID);
                //3.update and show the new budget
                updateBudget();
                 //4. calculate and update percentages
                updatePercentages();
            }
        };

        return{
            init: function(){
                console.log('app has Started');
                UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0
            });
                setupEventListener();
            }
        };

    })(budgetController, UIcontroller);

controller.init();
