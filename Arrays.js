'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// lets write our code...(in Jonas voice)

const displayMovements = function(movement, sort = false){
  // to empty the movement container first
  containerMovements.innerHTML = '';

  // We would make the sort action (code) a part of our display function but set it inactive (false) then 
  // call the displayMovements and set it active inside the sort btn handler function so that 
  // the functionality works everytime the sort btn is clicked.

  // We used slice to create a copy of the movements array cos sort would mutate the actual array which is not we want here

  const sortMovement = sort ? movement.slice().sort((a,b) => a - b) : movement 

  sortMovement.forEach(function(mov, i){ 
    let type = mov > 0 ? 'deposit' : 'withdrawal'; 
    const html = `
  <div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__value">${mov}€</div>
  </div>
  `;
  // to attach the 'html' variable above to the container movement in the HTML  
containerMovements.insertAdjacentHTML('afterbegin', html)
  })
}
// displayMovements(account1.movements) //Now called dynamically when we logIn

//LETS CALCULATE THE SUM OF MOVEMENTS USING THE REDUCE METHOD 

// Just like in the summary function. i used the whole account array as the parameter but
// here, its cos i want to create a new object data in the account. (account.balance) 
const calcDisplayBalance = function(account){
    account.balance = account.movements.reduce(function(acc, data){
    return acc + data
    }, 0)
    labelBalance.textContent = `${account.balance}€`
  } 

  // calcDisplayBalance(account1.movements); //Now called dynamically when we logIn

//LETS CREATE THE SUMMARY. deposits(income), withdrawals(out) and interest.

// i tweaked this function a bit by accessing the whole global account array bcos we want 
// to access the "interestRate" inside the accounts (line 106)

const calcDisplaySummary = function(account){
  const income = account.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0)
  labelSumIn.textContent = `${income}€`

  const out = account.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0)
  labelSumOut.textContent = `${Math.abs(out)}€`

  const interest = account.movements.filter(mov => mov > 0).map(deposit => (deposit * `${account.interestRate}`) / 100)
  .filter((int, i, arr) => int >= 1).reduce((acc, int)=>acc + int, 0)
  // console.log(interest)
  labelSumInterest.textContent = `${interest}€`
}  

// calcDisplaySummary(account1.movements) //Now called dynamically when we logIn

//LETS CREATE THE USERNAME USING THE USERS INITIALS.....................

// const createUserName = function(user){
//   const username = user.toLowerCase().split(' ').map(theName => theName[0]).join('')
//   return username
// }
// console.log(createUserName('Steven Thomas Williams'))

const createUserName = function(accs){
//we used forEach cos we want to mutate the accounts and not create a new one (map would be useful here)
  accs.forEach(function (acc){
    acc.username = acc.owner.toLowerCase().split(' ').map(theName => theName[0]).join('')
})
}
createUserName(accounts)

// REFRACTORING CODE FOR UI UPDATE

const updateUI = function(acc){
      // display movement
      displayMovements(acc.movements)

      // display balance
      calcDisplayBalance(acc) //here, we accesed the whole array cos we want
      // to be able to create a new object data inside each account
  
      // display summary
      calcDisplaySummary(acc) //here, we accessed the whole array cos we want 
      // to access a data inside it
} 

// IMPLEMENTING LOGIN

// Event Handler

// another amazing thing about forms is that when we click "Enter", it automatically triggers the btn event

let currentAccount; //we made this var outside cos we will need this information in other functions too 

btnLogin.addEventListener('click', function(event){
  event.preventDefault() // we did this cos by default a btn in an HTML form submits automatically & reloads the page 
  
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value)

  console.log(currentAccount);

  //Look below.. remember optional chaining ?
  if(currentAccount?.pin === Number(inputLoginPin.value)){
    
    // display UI and message
    labelWelcome.textContent = `Welcome Back, ${currentAccount.owner.split(' ')[0]}`
    containerApp.style.opacity = 100

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '' //this works bcos the asignment operator works from right to left
    inputLoginPin.blur(); //Make the pin input lose its focus

    // I refracted the code for UI update. 
    updateUI(currentAccount)
  } 
})

// IMPLEMENTING MONEY TRANSFERS

btnTransfer.addEventListener('click', function(e){
  e.preventDefault()
  const amount = Number(inputTransferAmount.value)
  const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value) 
  
  // Clean Input fields
  inputTransferAmount.value = inputTransferTo.value = ''
  
  // Set conditions for transfer
  if(amount > 0 && recieverAcc && amount <= currentAccount.balance 
    && currentAccount.username !== recieverAcc?.username){
      // console.log('Transfer Valid')

      // Doing the transfer 
      currentAccount.movements.push(-amount)
      recieverAcc.movements.push(amount)

      // Next is updating the UI. We could just copy&paste the 3 functions (display mov, bal & summary) but
      // thats not a good practice so instead we'll create a function for 'em. 🔰

      //Update UI
      updateUI(currentAccount)

    }
})

// IMPLEMENTING LOAN 

//see line 582 if you forget how the 'some' method works 
btnLoan.addEventListener('click', function(e){
  e.preventDefault();

  const amount = Number(inputLoanAmount.value)

  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)){

    // Add movement
    currentAccount.movements.push(amount)
    // Update UI
    updateUI(currentAccount)
    // Clear Input field
  }
  inputLoanAmount.value = ''
})

// CLOSING AN ACCOUNT
btnClose.addEventListener('click', function(e){
  e.preventDefault();
  
  
  // condition to close account
  if(currentAccount.username === inputCloseUsername.value && currentAccount.pin === Number(inputClosePin.value)){
    
    // We used a close cousin of the find method (findIndex) cos we're interrested the index than the element here
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    console.log(index)

    // Delete account
    accounts.splice(index, 1)
    
    // Hide UI
    containerApp.style.opacity = 0
  }
  
  // Clean Input fields
  inputCloseUsername.value = inputClosePin.value = ''
})

// SORT BUTTON

// To make the sort toggling work. We create a global var so that its value can be preserved after clicking the sort btn

let sorted = false;

btnSort.addEventListener('click', function(e){
  e.preventDefault();

  displayMovements(currentAccount.movements, !sorted)

  // this right here is what makes the toggling work 
  sorted = !sorted
})






/////////////////////////////////////////////////////////////////////////////////
// dog coding challenge
const juliaData = [3,5,2,12,7]
const kateData = [4,1,15,8,3]
const correctedJuliaData = juliaData.slice(1,3,4)

const checkDogs = function(dogsJulia, dogsKate){
  const finalData = dogsJulia.concat(dogsKate);
  finalData.forEach(function(data, index){
    const stage = data > 2 ? `an adult and is ${data} years  old` : 'still a puppy 🐶' 
    console.log(`
    Dog number ${index + 1} is ${stage}.
    `)
  })
}
checkDogs(correctedJuliaData, kateData)

//Jonas Solution Method
const checkDogs1 = function(dogsJulia, dogsKate){
  const correctedJuliaData = dogsJulia.slice();
  correctedJuliaData.splice(0, 1)
  correctedJuliaData.splice(-2)
  const dogs = correctedJuliaData.concat(dogsKate)
  dogs.forEach(function(dog, i){
    if(dog >= 3){
      console.log(`Dog number ${i + 1} is an adult and is ${dog} years old `)
    }else{
      console.log(`Dog number ${i + 1} is a puppy🐶`)
    }
  })
}
checkDogs1([9, 16, 6, 8, 3], [10, 5, 6, 1, 4])

// dog challenge 2.0.........................

const calcAverageHumanAge = function(dogsAges){
  const humanAge = dogsAges.map(function(dogAge, i){
    return dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4 
  }).filter(function(data){return data > 18})
  
  const average = humanAge.reduce(function(acc, value){return acc + value}, 0) / humanAge.length
  
  //below is another way of calculating average: [avg of 2 and 3 can be calc as 2/2 + 3/2 = 1.5]
  // and also a good use case for the whole array parameter. Not useless afterall 😅  
  
  // const average = humanAge.reduce(function(acc, value, i, arr){return acc + value/arr.length}, 0)
 
  // amatuer way 😅
  // let sum = 0;
  // for(const data of humanAge){
  //   sum += data
  // } 
  // const average = sum / humanAge.length

  // console.log(average)
  // console.log(humanAge)
  return average;
}
console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]))
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]))

// Challenge 3: Using chaining and arrow function for challenge 2.0

const calcAverageHumanAge1 = dogsAges => {
  const humanAge = dogsAges.map((dogAge, i) => dogAge <= 2 ? 2 * dogAge : 16 + dogAge * 4 ).filter(data => data > 18).reduce((acc, value, i,arr) => acc + value/arr.length, 0)
  
  return humanAge
}
  
console.log(calcAverageHumanAge1([5, 2, 4, 1, 15, 8, 3]))



/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

///////////////////////////////////////////////


//Begininng of the Array lectures 

// Array methods

// why do array have methods
// know for now that arrays are simply objects because like objects they also get methods. more in future lectures

// simple array tools

let arr = ['a', 'b', 'c', 'd', 'e']

//SLICE

//the slice method is similar to that of string 
console.log(arr.slice(2)) //this method does not change the initial array instead it gives a new array 
// only with the sliced part
console.log(arr.slice(2, 3)) //start and end in index count | | Note that like in string methods, the second
// input index in this case "3" is not included in the slicing 
console.log(arr.slice(-2)) //starting from the end/back
console.log(arr.slice(1, -2))

// we can create a shallow of the intended array using the slice method just like using the spread operator too
console.log(arr.slice())

//SPLICE

// is similar to slice with the exception that it actually mutates and changes the array
// console.log(arr.splice(2))
console.log(arr)
//in practice, we're not usually concerned with the result/value of ".splice" but we use it to remove data

// like removing the last data in an array
// arr.splice(-1)
console.log(arr)
// when .splice takes two parameters. the first is the index of the data, the other signifies number of data.
arr.splice(1, 2);
console.log(arr)

// REVERSE

// the 'reverse' actually does mutate the initial array   

const arr1 = ['j', 'i', 'h', 'g', 'f']
arr1.reverse()
console.log(arr1)

// CONCAT
// used for linking two arrays. (use is similar to the spread operator)
const letters = arr.concat(arr1)
console.log(letters) //arr is concatinated with arr1

// JOIN
// to transform all array data into one string seperated by an assigned character

console.log(letters.join('-'))

// NOTE: MAKE IT AN HABIT TO USE RESOURCES LIKE MDN AND stackOverflow whenever needed


// LOOPING OVER ARRAY USING forEach

// first of all, as we know we can use the normal "for loop" but in Jonas opinion:
// "The forEach is better"

const movementsTest = [200, 450, -400, 3000, -650, -130, 70, 1300];

for(const [i, movement] of movementsTest.entries()){
  if(movement > 0){
    console.log(`Movement ${i + 1}: You deposited #${Math.abs(movement)}`); 
  }else{
    console.log(`Movement ${i + 1}: You withdrew #${Math.abs(movement)}`);//the math.abs is to take the absolute value i.e remove any sign not a number and in this case, the minus sign
  }
} 

// Using forEach

// we use forEach as an Higher order function and it needs a call back function
// unlike normally, we're not calling the forEach function ourselves. it's been called automatically
// obviously cos its an inbuilt function right?😅

// the forEach function loops over the attributed array and for each array data it executes the call back function
// and passes in the array data value as an argument for each iteration.
console.log('----------------------forEach Loop----------------------------------')
//illustration
movementsTest.forEach(function(repEachArrayData, i, arr){
  if(repEachArrayData > 0){
    console.log(`Movement ${i + 1}: You deposited #${Math.abs(repEachArrayData)}`); 
  }else{
    console.log(`Movement ${i + 1}: You withdrew #${Math.abs(repEachArrayData)}`);
  }
})

// remember that we can access indexes of our array data in for loop. we can too in forEach loop. observe !

// luckily its easier to access not just the current index but also the whole array in forEach.

// Note that while accessing the array value, index or whole array. the most important thing to note is not the 
// names of the arguments but the order of the arguments. Value-Index-Whole data

// one fundamental difference between forEach and for Loop. the break or continue can not be used in a forEach loop 

// Using forEach on Maps and Sets

// Maps  ...works in the same format as arrays

const currencies1 = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

currencies1.forEach(function(value, index, map){
  console.log(`${index}: ${value}`)
})

// Sets
const uniqueCurrencies = new Set(['USD', 'EUR', 'GBP', 'EUR', 'GBP', 'USD', 'EUR'])

uniqueCurrencies.forEach(function(value, _, map){
  // console.log(`${index}: ${value}`)
  console.log(`${value}: ${value}`)
})
// You already know but lemme just say it...
// the set doesn't store indexes so the only data really stored are the values and this 
// explains the weird result 

// so we could just use an underscore to avoid confusion. the _ denotes a throw away variable

// DATA TRANSFORMATION WITH MAP, FILTER AND REDUCE. the 3 big popular array methods.  

// the MAP method.
// it is yet another method that we  can use to loop through arrays but unlike forEach, the MAP method gives 
// us a brand new array that contains in each position the result of applying a call back function to the initial array  

//lets assume the movement array [line 125] is in Euro and we want to convert to USD.

const euroToUsd = 1.1;

const movementsUSD = movements.map(function(arrData){
  return arrData * euroToUsd
})

//using arrow function
// const movementsUSD = movements.map(arrData => arrData * euroToUsd) 

console.log(movements)
console.log(movementsUSD)
// for Fun/Revision, lets replicate the above using the for of loop  
const movementsUSDfor = [];
for(const arrData of movements){
 movementsUSDfor.push(arrData * euroToUsd)
}
console.log(movementsUSDfor)

// the map method just like forEach also gets access to the index and whole array data  

const movementDescription = movements.map((mov, i) => 
`Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`
)
console.log(movementDescription)

//Even though the work of forEach and the Map method looks alike. there is a settle difference as forEach loops 
// individually through the array and is said to have a side effect(more later) (mutating an existing array), Map returns a new array based on 
// operations run on the initial array and is said to not have the so called side effect (i.e does not mutate the initial array but returns a new one).

// Still on the matter...
// If we are not creating a new array and all we want is to modify an existing array then forEach 
// is probably a better option 


// THE FILTER METHOD.
// is used to filter out data from an array using a set condition in the call back function.

const deposits = movements.filter(function(data){return data > 0;})
console.log(deposits)
// Using the 'for' loop to achieve the same result...
const depositsFor = []
for(const dep of movements){
  if(dep > 0){depositsFor.push(dep)} 
}
console.log(depositsFor)

// As expected we get the same result but again there is a settle difference and we need to appreciate the 
// array methods (filter here). The filter method is shorter and as an advantage of chaining (like we used the map method [line 94])
// and that is basically impossible in the for of loop.

const withdrawals = movements.filter(mov => mov < 0)
console.log(withdrawals)

// THE REDUCE METHOD
// we use the reduce method to boil down all the array elements to a single data. More like a snowball effect 

// the syntax of the reduce method is slightly different from the map and filter by having the "accumulator"
// as the first of its parameters then the rest default follows.

// the accumulator as the name suggests, accumulates the array data starting with an assigned value, '0' in the example below 

// const balance = movements.reduce(function(accumulator, value, index, wholeData){
//   return accumulator + value
// }, 0)

// Using Arrow Function
const balance = movements.reduce((accumulator, value) => accumulator + value, 0)

console.log(balance)

// as usual, lets compare with a for of loop.
let sum = 0
for(const bal of movements) sum += bal

console.log(sum)

// How to use reduce to get the maximum value of an array? incomplete video😢

// CHAINING METHODS

const totalDepositsUSD = movements.filter(mov => mov > 0).map(mov => mov * euroToUsd)
.reduce((acc, mov) => acc + mov, 0)

console.log(totalDepositsUSD)

// a downside of chaining methods is that when an error occurs you might not know where it went wrong but
// this can be solved by checking (using console) in each chain step.

// THE FIND METHOD. 
// More similar to the filter method with the exception that it doesn't return a new array but only the first
  //element that satisfies the condition set 

  // usually the goal of the find method is to find one element

  const firstWithdrawal = movements.find(mov => mov < 0)
  console.log(movements)
  console.log(firstWithdrawal)

  // the above example is boring. Here's a real case:
  
  const account = accounts.find(acc => acc.owner === 'Jessica Davis')

  console.log(account)

// Using for of loop for the above...

//  for(const acc of accounts){
//  const account = acc.owner === 'Jessica Davis' ? acc.owner : false
//  console.log(account)
// }  // NOT CORRECT !!!!!!!!!!!!

// SOME AND EVERY (still on array methods)

// We can use .includes to check for a value in an array as it returns a boolean value but
// it only checks for *equality whereas...

const incCheck = movements.includes(-130)
console.log(incCheck)

// SOME which also serves the same function but checks for a *condition (if any or at least one data satisfies) 
// and that is very handy

// when we need a condition stating something like "at least" then the some method should come to mind
const incCheck1 = movements.some(mov => mov > 10000000)
console.log(incCheck1)

// EVERY method works almost like SOME but as you guessed it checks for a condition that all the array data must 
// satisfy to give a true boolean as specified.

const incCheck2 = movements.every(mov => mov > 0)
console.log(incCheck2)

const incCheck3 = account4.movements.every(mov => mov > 0)
console.log(incCheck3)

// One other thing is. To make our code DRY. instead of always typing out a regularly used call back function
// we could do store it seperately and reuse.

const depositCallBack = mov => mov > 0

console.log(movements.some(depositCallBack))
console.log(movements.every(depositCallBack))
console.log(movements.filter(depositCallBack))

// FLAT AND FLATMAP METHOD

// the flat method is used in case of a nested array to un-nest or basically flat all the array data
const arrDeep = [1,2,3,[4,5],6,[7,8]]
console.log(arrDeep.flat())
// and incase of an even deeper array, we can flat at a deeper level too
const arrDeeper =  [1,2,[3,[4,5]],6,[7,8]]
console.log(arrDeeper.flat(2))

// The above example isn't really useful. Here's a more useful illustration.

// Let's assume the Bank itself wants to gather all the accounts movements to calculate thier overall amount.

// const accountMovements = accounts.map(mov => mov.movements)
// const accountMovementsTotal = accountMovements.flat()
// const accountBalance = accountMovementsTotal.reduce((acc, mov) => acc + mov, 0)

const accountBalance = accounts.map(mov => mov.movements).flat().reduce((acc, mov) => acc + mov, 0)
console.log(accountBalance)

// Just as Illustrated in the above. Using a Map and a Flat is a common scenario so the flatMap was made to 
// serve both purpose of Map and Flat.

// Note that flatMap only goes one level deep in flattening and we cannot change it

const accountBalance1 = accounts.flatMap(mov => mov.movements).reduce((acc, mov) => acc + mov, 0)
console.log(accountBalance1)

// SORTING ARRAYS
// there are different approaches to this but for now we'll work on the javaScript approach.

// With Strings
const owners = ['Abdurahman', 'Khadijah', 'Zayd', 'Sodiq']
console.log(owners.sort())
// the sort method actually mutates the array
console.log(owners)

// With Numbers
console.log(movements.sort()) //It indeed doesn't make sense cos it uses the string sorting approach. 
// We need to solve this. using a call back function

// Here's a pattern (Note - a and b are 2 corresponding numbers in the array):
// if a > b then switch data by returning a value greater than 0 || SWITCH : VALUE > 0
// if a < b then keep data by returning a value less than 0 || KEEP : VALUE < 0

// Ascending Order
// movements.sort((a,b) => {
//   if(a > b) return 1
//   if(a < b) return -1 
// })
// We could DRAMATICALLY improve the above approach
movements.sort((a,b) => a - b)
console.log(movements)

// Descending Order
// movements.sort((a,b) => {
//   if(a > b) return -1
//   if(a < b) return 1 
// })
// Here too !
movements.sort((a,b) => b - a)
console.log(movements)

// ALERT: if you have a mixed array data of numbers and strings then you should NOT use the sort method.
// Lets impelement the sort in our Bank App !


// MORE WAYS OF CREATING AND FILLING ARRAYS

// We create arrays using 2 methods.
const x1 = [1,2,3,4,5,6,7]
console.log(x1)
console.log(new Array(1,2,3,4,5,6,7))

// One weird thing bout the new Array syntax.
const x = new Array(7); //This creates an empty array with a length of 7.
// This isn't really useful cos we for example can't call the Map method on it BUT 
// we can call the FILL method on it and you should know that this method mutates the array  
console.log(x) 

// THE FILL METHOD

// x.fill(1)
// console.log(x)
x.fill(1,3)
console.log(x)
// Its not only empty arrays we can use fill method on
x1.fill(11, 3, 5) //first parameter = value || second = start point || third = end point (minus last data)
console.log(x1)

// Another way of creating arrays dynmically (better) is using ARRAY.FROM

// Array.From takes 2 data. In this instance, the length and a call back function which gets access to the 
// intended array current data and the index

const y1 = Array.from({length: 10}, () => 1)
console.log(y1)

const y = Array.from({length: 10}, (cur, i) => i + 1) //This method is better than using the new Array + fill
console.log(y)

// Try and use this to generate 100 random dice rolls
const diceRolls = Array.from({length: 100}, () => Math.trunc(Math.random() * 6))
console.log(diceRolls) //Done ✔

// Array.From was actually made to convert other iterable data structure (strings, maps, sets...) to arrays.

// Remember querySelectorAll (returns a node list) that we used in a Modal project.? It looks like an array structure but 
// it actually isn't. This or other similar data structures can be converted to an array using array.from  

// Lets assume we dont have the movements value stored in our code only in the UI and we want to get it. 

const movementsUI0 = Array.from(document.querySelectorAll('.movements__value')) 
// the above only accesses the initial data in the HTML doc. but if we want our UI movements data, we need
// to access it through an event listener on the UI layout.

labelBalance.addEventListener('click', function(){
  const movementsUI = Array.from(document.querySelectorAll('.movements__value'), mov => Number(mov.textContent.replace('€', ''))) 
  
  // We actually need to remove the euro sign & convert to number. we can use map. Lets do it below 
 
  // We could just put the map code below as the second parameter of the movementsUI bcos the second parameter is
  // for its mapping call back function

  // console.log(movementsUI.map(mov => Number(mov.textContent.replace('€', ''))))
  console.log(movementsUI)
})

// To Recap, the first parameter of the Array.from is like the container for the value to be worked on and then
// the second parameter is for mapping the call back function in regards to the data of the first parameter.📌

// Steps Recap.
/*
We used array.from to create an array from a node list from our UI and then on this, 
we made a mapping call back function to get the actual numbers we intended   
*/

// We could also use the spread operator to convert the node list to an array but then we would have to the 
// mapping seperately 

// WHICH ARRAY METHOD TO USE.

// we've learnt 23 array methods so far.

// To mutate Original array: 
// push, unshift, pop, shift, splice, reverse, sort, fill

// To create a new array:
// Map(loop), filter(loop), slice, concat, flat, flatMap

// To get array index:
// IndexOf, findIndex

// To get an array element:
// find

// To know if array includes:
// includes, some, every

// To get a new string:
// join

// To transform to a value:
// reduce

// To just loop array:
// ForEach  

// FINAL CHALLENGE

const dogs = [
  {weight: 22, curFood: 250, owners: ['Alice', 'Bob']},
  {weight: 8, curFood: 200, owners: ['Matilda']},
  {weight: 13, curFood: 275, owners: ['Sarah', 'John']},
  {weight: 32, curFood: 340, owners: ['Michael']},
];

// 1.

// I had to check the Bankist Code to solve this. 😖

const calcRecommendedFood = function(dogObjects){
  
  dogObjects.forEach(data => data.recommendedFood = data.weight ** 0.75 * 28)
  
  // console.log(dogs)
}

calcRecommendedFood(dogs)

// JONAS CORRECTION
dogs.forEach(dog => dog.recFood = Math.trunc(dog.weight ** 0.75 * 28))

console.log(dogs)
// 2.  

// Being within a range 10% above and below the recommended means cur > rec * 0.9 && < rec * 1.1

//JONAS CORRECTION
const sarahDog = dogs.find(cur => cur.owners.includes('Sarah'))
console.log(sarahDog)
console.log(`Sarah's dog is eating too ${sarahDog.curFood > sarahDog.recFood ? 'Much' : 'Less'}`)

const dogEatRate = function(dogObjects){
  // 3.
  const eatTooMuch = dogObjects.filter(eatData => eatData.curFood > eatData.recommendedFood * 1.1)
  .map(cur => cur.owners).flat(2)
  
  // jonas addition (using flatMap instead)
  const eatTooMuch1 = dogObjects.filter(eatData => eatData.curFood > eatData.recommendedFood * 1.1)
  .flatMap(cur => cur.owners)

  console.log(eatTooMuch);
  // 4.
  const conLog = eatTooMuch.join(' and ') + `'s dogs' eat too much!`
  console.log(conLog)
  
  const eatTooLittle = dogObjects.filter(eatData => eatData.curFood < eatData.recommendedFood * 0.9)
  .map(cur => cur.owners).flat(2)
  
  console.log(eatTooLittle);
  const conLog1 = eatTooLittle.join(' and ') + `'s dogs eat too little!`
  console.log(conLog1)
  
  // 5.
  const equalRate = dogObjects.some(eatData => eatData.curFood === eatData.recommendedFood)
  console.log(equalRate)
  
  // 6.
  // const okFood = dogObjects.some(eatData => eatData.curFood > eatData.recommendedFood * 0.9 && eatData.curFood < eatData.recommendedFood * 1.1)
  
  // Jonas addition:
  // Since the callback above (in 6) is repeating (in 7) then we can just store it in a variable instead
  const checkEatingOk =  eatData => eatData.curFood > eatData.recommendedFood * 0.9 && eatData.curFood < eatData.recommendedFood * 1.1
  
  const okFood = dogObjects.some(checkEatingOk)
  console.log(okFood)  

  // 7.
  const okFoodArray = dogObjects.filter(checkEatingOk)

  console.log(okFoodArray)
  // 8.
  const foodSort = dogObjects.slice().map(cur => cur.recommendedFood).sort((a,b) => a - b)
  console.log(foodSort)
  
  // JONAS CORRECTION
  const foodSorting = dogObjects.slice().sort((a,b) => a.recFood - b.recFood)
  console.log(foodSorting)
}

dogEatRate(dogs)
// 4.
// Done in above function.

// 5.
// Done in above function.

// 6.
// Done in above function.

// 7.
// Done in above function.

// 8. 
// Done in above function.