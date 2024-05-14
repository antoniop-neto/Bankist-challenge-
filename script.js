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

/////////////////////////////////////////////////

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? `deposit` : `withdrawal`;
    const html = `<div class="movements__row">
                    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
                    <div class="movements__date">3 days ago</div>
                    <div class="movements__value">${mov}€</div>
                  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements.filter(mov => mov > 0);
  const totalIn = incomes.reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${totalIn}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = incomes
    .map(income => income * (acc.interestRate / 100))
    .filter(income => income >= 1)
    .reduce((acc, income) => acc + income);
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accounts) {
  accounts.forEach(account => {
    account.username = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);
  // Display balance
  calcDisplayBalance(acc);
  // Display summary
  calcDisplaySummary(acc);
};

let currentAccount;

btnLogin.addEventListener('click', function (event) {
  event.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // Display de UI and message
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const transferTo = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  // validations
  if (
    amount > 0 &&
    transferTo &&
    amount <= currentAccount.balance &&
    transferTo.username !== currentAccount.username
  )
    // add the negative amount to the current
    currentAccount.movements.push(-amount);
  // add the positive amount to the transferTo user
  transferTo.movements.push(amount);
  updateUI(currentAccount);
});

btnLoan.addEventListener('click', function (event) {
  event.preventDefault();
  const amount = Number(inputLoanAmount.value);
  inputLoanAmount.value = '';
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', function (event) {
  event.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(acc => {
      return acc.username === currentAccount.username;
    });
    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
    accounts.splice(index, 1);
  }
});

let sorted = false;

btnSort.addEventListener('click', function (event) {
  event.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// let arr = ['a', 'b', 'c', 'd', 'e'];

// // SLICE method -> Remove part of or total array without change the original one. The first argument represent the first index and the second one, the next index. For example: 'slice(1, 5)' means from the index one until the index 5. Obs.: like strings the first index is included but the last index is not.
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// // shallow copy of an array
// console.log(arr.slice());
// console.log([...arr]);

// // SPLICE method -> Remove part of or total array changing the original one. The first argument represent the index that will be removed and the second how many elements from there will be removed. For example: 'splice(1, 2)' in this array -> ['a', 'b', 'c', 'd', 'e'] will return [b, c].

// console.log(arr.splice(-1));
// console.log(arr);
// console.log(arr.splice(1, 2));
// console.log(arr);

// // REVERSE method does mutate the array
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];

// arr2.reverse();
// console.log(arr2);

// // CONCAT method does NOT mutate the array

// const letters = arr.concat(arr2);
// console.log(letters);
// // another option to concatenate arrays
// console.log([...arr, ...arr2]);

// // JOIN
// console.log(letters.join(' - '));

// // AT method
// const arr3 = [11, 23, 64];
// // traditional way to retrieve data from a specific index
// console.log(arr3[0]);
// console.log(arr3[arr3.length - 1]); // to get the last position

// // using AT method
// console.log(arr3.at(0));
// console.log(arr3.at(-1));
// // ALSO works in STRINGS
// console.log('Antonio'.at(-1));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`You deposited $${movement}`);
//   } else {
//     console.log(`You withdrew $${Math.abs(movement)}`);
//   }
// }

// for (const [i, mov] of movements.entries()) {
//   if (mov > 0) {
//     console.log(`Movement ${i}: You deposited $${mov}`);
//   } else {
//     console.log(`Movement ${i}: You withdrew $${Math.abs(mov)}`);
//   }
// }

// console.log('############ forEach ###########');

// movements.forEach(mov => {
//   if (mov > 0) {
//     console.log(`You deposited ${mov}€`);
//   } else {
//     console.log(`You withdrew ${Math.abs(mov)}€`);
//   }
// });

// movements.forEach((mov, i, arr) => {
//   if (mov > 0) {
//     console.log(`Movement ${i}: You deposited ${arr[i]}€`);
//   } else {
//     console.log(`Movement ${i}: You withdrew ${Math.abs(mov)}€`);
//   }
// });

// // MAPs and SETs
// console.log('########### forEath -> MAPs ############');

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach((value, key, map) => {
//   console.log(`${key}: ${value}`);
// });
// console.log('########### forEath -> SETs ############');

// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);

// // Since SETs have no KEYs or INDEXs, forEach will use the argument 'key' like 'value' as well. It was made like this to not be necessary change the forEach method only to adapt to SETs. It could be confuse
// currenciesUnique.forEach((value, key, map) => {
//   console.log(`${key}: ${value}`);
// });

/* ###################### CHALLENGE 1 ########################

Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each).
For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

##################
age >= 3 : adult
age < 3 : puppy
##################
Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)

##################################################
0 and -2, -1 are cats -> shallow copy without cats
##################################################

2. Create an array with both Julia's (corrected) and Kate's data
##############################
OnlyDogsJulia.concat(dogsKate)
##############################

3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy")

4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far
TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
GOOD LUCK
*/

// const checkDogs = function (dogsJulia, dogsKate) {
//   const OnlyDogsJulia = dogsJulia.slice(1, -2);
//   const allDogs = OnlyDogsJulia.concat(dogsKate);
//   allDogs.forEach((dog, i) => {
//     if (dog >= 3) {
//       console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a puppy`);
//     }
//   });
//   console.log(allDogs);
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUSD = 1.1;

// const movementsUSD = movements.map(mov => mov * eurToUSD);

// console.log(movements);
// console.log(movementsUSD);

// // Same thing but using for_of method

// const movementsUSDfor = [];

// for (const mov of movements) {
//   movementsUSDfor.push(mov * eurToUSD);
// }
// console.log(movementsUSDfor);

// const movementsDescriptions = movements.map(
//   (mov, i) => `Movement ${i}: You ${mov > 0 ? 'deposited' : 'withdrew'} $${mov}`
// );
// console.log(movementsDescriptions);

// FILTER

// const deposits = movements.filter(mov => mov > 0);
// console.log(deposits);

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);
console.log(depositsFor);

const withdrawals = movements.filter(mov => mov < 0);
console.log(withdrawals);

// REDUCE method

console.log(movements);
// accumulator -> SNOWBALL
// const balanceExample = movements.reduce((acc, mov, i, arr) => {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + mov;
// }, 0);

const balance = movements.reduce((acc, mov) => acc + mov, 0);
console.log(balance);

// Maximum value

const maximum = movements.reduce(
  (acc, mov) => (mov < acc ? acc : mov),
  movements[0]
);

console.log(maximum);

/* ###################### CHALLENGE 2 ########################
Let's go back to Julia and Kate's study about dogs.
This time，they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an array of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following
formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4. - MAP

2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old) - FILTER

3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉 ) - REDUCE

4. Run the function for both test datasets
TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀

1.
Which type it is going to receive ? -> array of numbers
Which type it is going to return ? -> an array of new numbers

AVERAGE -> [2, 3] -> (2 + 3) / 2 OR (2 / 2) + (3 / 2)

*/

// const calcAverageHumanAge = function (dogs) {
//   const humanAges = dogs.map(dog => (dog <= 2 ? 2 * dog : 16 + dog * 4));
//   const adultDogs = humanAges.filter(dog => dog >= 18);
//   return adultDogs.reduce((acc, dog, i, arr) => acc + dog / arr.length, 0);
// };

// CHANING

const calcAverageHumanAge = dogs =>
  dogs
    .map(dog => (dog <= 2 ? 2 * dog : 16 + dog * 4))
    .filter(dog => dog >= 18)
    .reduce((acc, dog, i, arr) => acc + dog / arr.length, 0);

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// FIND method
const firstWithdrawal = movements.find(mov => mov < 0);
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);

const account = accounts.find(acc => acc.owner === 'Jessica Davis');
console.log(account);

// Using For loop for the same operation

for (const [i, account] of accounts.entries()) {
  if (account.owner === 'Jessica Davis') {
    console.log(accounts[i]);
    break;
  }
}

// console.log(movements);

// // EQUALITY
// console.log(movements.includes(-130));

// // SOME (one of the elements pass in the condition): EQUALITY
// console.log(movements.some(mov => mov === -130));

// // SOME: CONDITION
// const anyDeposit = movements.some(mov => mov > 0);
// console.log(anyDeposit);

// // EVERY (all the elements pass in the condition)
// console.log(movements.every(mov => mov > 0));

// console.log(account4.movements.every(mov => mov > 0));

// Separate callback
const deposits = function (mov) {
  return mov > 100;
};
console.log(account4.movements.every(deposits));
console.log(account4.movements.some(deposits));
console.log(account4.movements.filter(deposits));

const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// FLAT method -> without any argument it goes only one level deep
console.log(arr.flat());

const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];

console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => acc.movements);
// console.log(accountMovements);

// const allAccountMovements = accountMovements.flat();
// console.log(allAccountMovements);

// const overalBalance = allAccountMovements.reduce((acc, mov) => acc + mov, 0);

// console.log(overalBalance);

// chaining

// FLAT
const overalBalance2 = accounts
  .map(acc => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

console.log(overalBalance2);

// FLATMAP -> only one level deep

const overalBalance3 = accounts
  .flatMap(acc => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

console.log(overalBalance3);

// SORT method -> it mutates the array

// Strings
const owners = ['Jonas', 'Zach', 'Adam', 'Martha'];
console.log(owners.sort());
console.log(owners);

// Numbers
console.log(movements);

// return < 0, (A, B) -> keep order
// return > 0, (B, A) -> switch order

// // Ascending
// movements.sort((a, b) => {
//   if (a > b) return 1; // return any positive number. it does NOT need to be one
//   if (a < b) return -1; // return any negative number;
// });

// // Descending
// movements.sort((a, b) => {
//   if (a > b) return -1; // return any positive number. it does NOT need to be one
//   if (a < b) return 1; // return any negative number;
// });

// LOGIC  of (a - b)

// if a is bigger then b, (a - b) will be a POSITIVE number. Result of the first validation.

// if b is bigger then a, (a - b) will be a NEGATIVE number. Result of the second validation.

// So the same count could be used to both conditions:

// Ascending
movements.sort((a, b) => a - b);
console.log(movements);
// Descending
movements.sort((a, b) => b - a);
console.log(movements);

// Array.from

const dice100 = Array.from(
  { length: 100 },
  (_, i) => (i = Math.floor(Math.random() * 6) + 1)
);

console.log(dice100);

// Getting the balance from the DOM
// it is necessary use an event handler, otherwise the querySelector you get the static values that are on the HTML before run the app.

// adding event handler
labelBalance.addEventListener('click', function () {
  // creating an array to get the values from the movements
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value')
  );

  const textContentMovementsUI = movementsUI.map(element =>
    Number(element.textContent.replace('€', ''))
  );
  console.log(textContentMovementsUI);
});

// OR direct with Array.from

labelBalance.addEventListener('click', function () {
  const movementsUI2 = Array.from(
    document.querySelectorAll('.movements__value'),
    element => Number(element.textContent.replace('€', ''))
  );
  console.log(movementsUI2);
});

const bankDepositsSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);

console.log(bankDepositsSum);

const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;

const deposits1000Amount = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, mov) => (mov >= 1000 ? ++count : count), 0);

console.log(deposits1000Amount);
console.log(numDeposits1000);

// Prefix ++ operator

let a = 10;
console.log(a++); // Result: 10 -> the ++ operator add 1 but not immediately
console.log(a); // Result: 11 -> it is possible to see the increment only in the next iteration

a = 10;
console.log(++a); // Result: 11 -> Prefix ++ operator add 1 immediately.

// REDUCE method

const depositsAndWithdrawals = accounts
  .flatMap(acc => acc.movements)
  .reduce(
    (sum, mov) => {
      // mov > 0 ? (sum.deposits += mov) : (sum.withdrawals += mov);
      sum[mov > 0 ? 'deposits' : 'withdrawals'] += mov;
      return sum;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(depositsAndWithdrawals);

// Only using REDUCE method

const depositsAndWithdrawals2 = accounts
  .reduce((sums, acc) => {
    sums.push(...acc.movements);
    return sums;
  }, [])
  .reduce(
    (obj, mov) => {
      obj[mov > 0 ? 'deposits' : 'withdrawals'] += mov;
      return obj;
    },
    { deposits: 0, withdrawals: 0 }
  );

console.log(depositsAndWithdrawals2);

const convertTitleCase = function (title) {
  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = [
    'a',
    'an',
    'and',
    'This',
    'but',
    'the',
    'or',
    'on',
    'in',
    'with',
  ];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => (exceptions.includes(word) ? word : capitalize(word)))
    .join(' ');
  return capitalize(titleCase);
};
// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and this is another title with an EXAMPLE'));

/*
########################## Coding Challenge 4 #############################

Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

Your tasks:

1. Loop over the 'dogs' array containing dog objects, and for each dog,calculate the recommended food portion and add it to the object as a new property. Do not create a new array, simply loop over the array. Formula: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)

2. Find Sarah's dog and log to the console whether it's eating too much or too little. Hint: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓

3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').

4. Log a string to the console for each array created in 3.,likethis: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"

5. Log to the console whether there is any dog eating exactly the amount of food that is recommended (just true or false)

6. Log to the console whether there is any dog eating an okay amount of food (just true or false)

7. Create an array containing the dogs that are eating an okay amount of food(try to reuse the condition used in 6.)

8. Create a shallow copy of the 'dogs' array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects😉)

Hints:
* Use many different tools to solve these challenges, you can use the summary lecture to choose between them😉

* Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

GOOD LUCK😀

Test data:
*/
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

const dogEating = function (current, recommended) {
  if (current > recommended * 0.9 && current < recommended * 1.1) {
    return `Eating an okay amount`;
  } else if (current < recommended * 0.9) {
    return `Eating too little`;
  } else if (current > recommended * 1.1) {
    return `Eating too much`;
  }
};

// 1.
dogs.forEach(dog => {
  dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28);
});
console.log(dogs);
// 2.
const saraDog = dogs.find(dog => dog.owners.includes('Sarah'));
dogEating(saraDog.curFood, saraDog.recommendedFood);

// 3.
const ownersEatTooMuch = dogs
  .filter(
    dog => dogEating(dog.curFood, dog.recommendedFood) === 'Eating too much'
  )
  .reduce((owners, dog) => {
    owners.push(dog.owners);
    return owners;
  }, [])
  .flat();

const ownersEatTooLittle = dogs
  .filter(
    dog => dogEating(dog.curFood, dog.recommendedFood) === 'Eating too little'
  )
  .reduce((owners, dog) => {
    owners.push(dog.owners);
    return owners;
  }, [])
  .flat();
// 4.
console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);
// 5.
console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));
// 6.
console.log(
  dogs.some(
    dog =>
      dogEating(dog.curFood, dog.recommendedFood) === 'Eating an okay amount'
  )
);
// 7.
const okAmontOfFood = dogs.filter(
  dog => dogEating(dog.curFood, dog.recommendedFood) === 'Eating an okay amount'
);
console.log(okAmontOfFood);
// 8.
const dogsCopy = Array.from(dogs, dog => dog.recommendedFood).sort(
  (a, b) => a - b
);

console.log(dogsCopy);
