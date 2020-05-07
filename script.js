import { User } from "./User.js";

const user = new User();

const addItem = document.getElementById("add-item");
const itemName = document.getElementById("product-name");
const itemQuantity = document.getElementById("product-qty");

// Get value by destructuring, non-atomic ID's are bad practice
const [productsTable] = document.getElementsByClassName("c-products-list");

const populateTable = (product, quantity) => {
  // Indexes will be glitched for random removals, notably some indexes may
  // repeat when adding items after deleting others, but the fix is out
  // of scope of effort for this lab
  const nRows = productsTable.rows.length;
  const row = productsTable.insertRow(nRows);

  const cell1 = row.insertCell(0);
  const cell2 = row.insertCell(1);
  const cell3 = row.insertCell(2);

  cell1.innerText = `${nRows + 1}.`;
  cell2.innerText = product;
  cell3.innerText = quantity;
};

const generateTable = (target) => {
  try {
    const products = JSON.parse(localStorage.getItem(target));
    for (const product in products) {
      if (products.hasOwnProperty(product))
        populateTable(product.trim(), products[product]);
    }
  } catch {
    localStorage.setItem(user.name, "{}");
  }
};

const storeData = (key, value, cache = {}) => {
  // Bugged for strings: will generate and display in 0 indexed increment
  // Fix out of scope of lab
  if (Object.keys(cache).length !== 0) {
    const parsedData = JSON.parse(localStorage.getItem(user.name));
    if (key in parsedData) throw "iea"; // item exists already
  }
  cache[key] = value;
  localStorage.setItem(user.name, JSON.stringify(cache));
};

const deleteData = (key) => {
  const parsedData = JSON.parse(localStorage.getItem(user.name));

  // Get the index of the key to delete from table
  const keys = Object.keys(parsedData);
  let index = keys.indexOf(key);

  if (index === -1) throw "tfyd"; // The fak you doing?
  delete parsedData[key];

  localStorage.setItem(user.name, JSON.stringify(parsedData));
  return index;
};

const clearOutput = () => {
  itemName.value = "";
  itemQuantity.value = "";
};

// A block? Why not.
{
  if (user.hasName()) {
    user.name = sessionStorage.getItem("name");
  } else {
    user.name = prompt("What is your name?");
    document.cookie = `name=${user.name}`;
    sessionStorage.setItem("name", user.name);
  }

  document.getElementById("user-name").innerText = user.name;
  if (user.hasLocalStorage()) generateTable(user.name);
}

const processSubmit = () => {
  if (!itemName.value || !itemQuantity.value) return;
  try {
    const storedData = user.hasLocalStorage()
      ? JSON.parse(localStorage.getItem(user.name))
      : {};
    storeData(itemName.value, itemQuantity.value, storedData);
  } catch (error) {
    if (error === "iea") {
      alert("Item exists already");
      clearOutput();
      return;
    }
    // Won't remove table entries prior to tampering
    alert("Don't tamper with stuff!");
    storeData(itemName.value, itemQuantity.value);
  }

  populateTable(itemName.value.trim(), itemQuantity.value);
  clearOutput();
};

document.addEventListener("click", (event) => {
  // Use destructuring, equivalent to target = event.target
  const { target } = event;
  const parent = target.parentElement;
  // Switch case for more
  if (target === addItem) processSubmit();
  if (parent && parent.tagName === "TR") {
    // Get product name
    const key = parent.firstElementChild.nextSibling.innerText;

    try {
      const index = deleteData(key);
      productsTable.deleteRow(index);
    } catch (error) {
      if (error === "tfyd") alert("The fak you doing. I'm done with you.");
      else alert("Ay dios mio.");
    }
  }
});
