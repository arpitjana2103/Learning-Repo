"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
const EUROSIGN = "€";
// Data
const account1 = {
    owner: "Jonas Schmedtmann",
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2,
    pin: 1111,
};

const account2 = {
    owner: "Jessica Davis",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: "Steven Thomas Williams",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: "Sarah Smith",
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements, sort = false) {
    containerMovements.innerHTML = "";
    console.log(movements);
    let movementsClone = sort
        ? movements.slice().sort((a, b) => a - b)
        : movements;
    console.log(movementsClone);
    movementsClone.forEach(function (mov, i) {
        const type = mov > 0 ? "deposit" : "withdrawal";
        const html = `
            <div class="movements__row">
            <div class="movements__type movements__type--${type}">
            ${i + 1} ${type} </div>
            <div class="movements__value">${mov} ${EUROSIGN}</div></div>`;

        containerMovements.insertAdjacentHTML("afterbegin", html);
    });
};

// displayMovements(account1.movements);

const calcDisplayBalance = function (account) {
    account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
    labelBalance.textContent = `${account.balance} ${EUROSIGN}`;
};

// calcDisplayBalance(account1.movements);

const calcDisplaySummery = function ({ movements, interestRate }) {
    const incomes = movements
        .filter((mov) => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);

    labelSumIn.textContent = `${incomes} ${EUROSIGN}`;

    const outcomes = movements
        .filter((mov) => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);

    labelSumOut.textContent = `${-outcomes} ${EUROSIGN}`;

    const interest = movements
        .filter((mov) => mov > 0)
        .map((deposite) => (deposite * interestRate) / 100)
        .reduce((acc, int) => int + acc, 0);

    console.log(interest);

    labelSumInterest.textContent = `${interest} ${EUROSIGN}`;
};

// calcDisplaySummery(account1.movements);

const createUsernames = function (accounts) {
    accounts.forEach(function (acc) {
        acc.username = acc.owner
            .toLocaleLowerCase()
            .split(" ")
            .map((str) => str.charAt(0))
            .join("");
    });
};

createUsernames(accounts);

const updateUI = function (account) {
    displayMovements(account.movements);
    calcDisplayBalance(account);
    calcDisplaySummery(account);
};

// Event Handelers
let currentAccount;
btnLogin.addEventListener("click", function (e) {
    e.preventDefault();
    currentAccount = accounts.find(
        (acc) => acc.username === inputLoginUsername.value
    );

    if (currentAccount?.pin === +inputLoginPin.value.trim()) {
        // Display UI & Welcome Message
        labelWelcome.textContent = `Welcome back, ${currentAccount.owner
            .split(" ")
            .at(0)}`;
        containerApp.style.opacity = 100;

        // Clear Inputs
        inputLoginUsername.value = inputLoginPin.value = "";
        inputLoginPin.blur();

        updateUI(currentAccount);
    }
});

btnTransfer.addEventListener("click", function (e) {
    e.preventDefault();
    const amount = Number(inputTransferAmount.value);
    const receiverAccount = accounts.find(
        (acc) => acc.username === inputTransferTo.value
    );

    if (
        amount > 0 &&
        receiverAccount &&
        currentAccount.balance >= amount &&
        receiverAccount?.username !== currentAccount.username
    ) {
        currentAccount.movements.push(-amount);
        receiverAccount.movements.push(amount);
        updateUI(currentAccount);
    }

    inputTransferAmount.value = inputTransferTo.value = "";
});

btnClose.addEventListener("click", function (e) {
    e.preventDefault();
    if (
        inputCloseUsername.value.trim() === currentAccount.username &&
        +inputClosePin.value === currentAccount.pin
    ) {
        let index = accounts.findIndex(function (account) {
            return account.username === currentAccount.username;
        });

        // Delete Account
        accounts.splice(index, 1);

        // Hide UI
        containerApp.style.opacity = 0;
    }
});

btnLoan.addEventListener("click", function (e) {
    e.preventDefault();

    const amount = Number(inputLoanAmount.value);
    inputLoanAmount.value = "";

    if (
        amount > 0 &&
        currentAccount.movements.some((mov) => mov >= amount * 0.1)
    ) {
        // Add movement
        currentAccount.movements.push(amount);

        // Update UI
        updateUI(currentAccount);
    }
});

let isSorted = false;
btnSort.addEventListener("click", function (e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !isSorted);
    isSorted = !isSorted;
});
