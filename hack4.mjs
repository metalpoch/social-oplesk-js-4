import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = readline.createInterface({ input, output });

const menu = [
  {
    id: 1,
    product: "Burguer Normal",
    price: 3,
    qty: Math.floor(Math.random() * 15 + 5),
  },
  {
    id: 2,
    product: "Burguer Especial",
    price: 5,
    qty: Math.floor(Math.random() * 15 + 5),
  },
  {
    id: 3,
    product: "Burguer Super Especial",
    price: 10,
    qty: Math.floor(Math.random() * 15 + 5),
  },
  {
    id: 4,
    product: "Gaseosa Peque;a",
    price: 1,
    qty: Math.floor(Math.random() * 15 + 5),
  },
  {
    id: 5,
    product: "Gaseosa Grande",
    price: 3,
    qty: Math.floor(Math.random() * 15 + 5),
  },
];

const client = {
  alias: null,
  balance: Math.floor(Math.random() * 150 + 50),
  shopping: [],
  paymentType: null,
};

const ask = async (question, pointer = ">> ") => {
  console.log(question);
  return await rl.question(pointer);
};

const clearTerminal = () => {
  console.clear();
  const deco = [...Array(20)].map((_) => "*").join("");
  console.log(deco, "NASA Burger's", deco);
};

const redirect = (msg) => {
  console.log(msg);
  console.log("redireccionando a la pagina principal...");
  setTimeout(() => {
    clearTerminal();
    viewHome();
  }, 1500);
};

const showMenu = () => {
  console.log("ID\tProducto\t\tPrecio");
  menu.forEach((item) => {
    const id = item.id;
    const product =
      item.product.length > 15 ? `${item.product}\t` : `${item.product}\t\t`;
    const price = item.price;
    console.log(`${id}\t${product}$${price}`);
  });
};

// home
const viewHome = async () => {
  const alias = client.alias;
  const paymentType = client.paymentType;
  const balance = client.balance;
  console.log(
    `${alias}, su saldo de la cuenta ${paymentType} es de: ${balance}`
  );
  console.log(
    "\n\
  a) visualizar stock\n\
  b) Agregar productos al carrito\n\
  c) Ver carrito\n\
  x) Salir"
  );
  const answer = await ask("");
  console.log(answer);
  if (answer === "a") viewStock();
  else if (answer === "b") viewAddProduct();
  else if (answer === "c") viewShoppingCart();
  else if (answer === "x") rl.close();
  else {
    console.clear();
    viewHome();
  }
};

// Opt a)
const viewStock = () => {
  clearTerminal();
  console.log("ID\tProducto\t\tCantidad\tPrecio");
  menu.forEach((item) => {
    const id = item.id;
    const product =
      item.product.length > 15 ? `${item.product}\t` : `${item.product}\t\t`;
    const qty = item.qty;
    const price = item.price;
    console.log(`${id}\t${product}${qty}\t\t$${price}`);
  });
  console.log();
  viewHome();
};

// Opt b)
const viewAddProduct = async () => {
  clearTerminal();
  showMenu();
  console.log();
  const id = await ask("Ingrese el ID de su pedido");
  const product = menu.find((item) => item.id == id);
  if (typeof product === "undefined") {
    redirect("El producto ingresado no existe es invalido");
  } else {
    const productName = product.product;
    const price = Number(product.price);
    const qty = Number(
      await ask(`Indique la cantidad de ${productName} deseada`)
    );

    if (qty < 0) {
      clearTerminal();
      viewHome();
    }
    const cost = Number(qty * price);
    console.log(`El costo de ${qty} ${productName} es de ${cost}`);
    const confirm = await ask("Deseas continuar?", "(y/N)> ");

    if (confirm.toLowerCase() === "y" || confirm.toLowerCase() === "s") {
      const result = client.shopping.find((item, index) => {
        if (item.product == productName) {
          client.shopping[index]["qty"] += qty;
          client.shopping[index]["cost"] += cost;
          return true;
        }
      });

      if (!result) client.shopping.push({ product: productName, qty, cost });

      if (product.qty < qty) {
        redirect("Lo siento, no disponemo de esa cantidad");
      } else {
        menu.find((item, index) => {
          if (item.id == id) {
            menu[index]["qty"] -= qty;
          }
        });
        redirect("El producto añadido sastifactoriamente al carrito");
      }
    } else redirect("Pedido cancelado");
  }
};

// Opt c)
const viewShoppingCart = async () => {
  clearTerminal();
  const balance = client.balance;
  const shoppingCart = client.shopping;
  console.log("En su carrito posee:");
  console.log("Item\tProducto\t\tCantidad\tPrecio");
  const total = [0];
  shoppingCart.forEach((item, index) => {
    const qty = item.qty;
    const cost = item.cost;
    const product =
      item.product.length > 15 ? `${item.product}\t` : `${item.product}\t\t`;
    total[0] += cost;
    console.log(`${index + 1}\t${product}${qty}\t\t$${cost}`);
  });
  console.log();
  console.log(`Saldo    : $${balance}`);
  console.log(`Total    : $${total}`);
  console.log(`Reembolso: $${balance - total}\n`);

  if (balance < total) {
    console.log(
      "Lo siento, no posee saldo suficiente para realizar la compra."
    );
    rl.close();
  }
  const confirm = await ask("Deseas realizar la compra?", "(y/N)> ");
  if (confirm.toLowerCase() === "y" || confirm.toLowerCase() === "s") {
    client.balance -= total;
    client.shopping = [];
    redirect("Compra realizada exitosamente!");
  } else redirect("Compra cancelado");
};

client.alias = await ask("Bienvenido, por favor ingrese su nombre");
client.paymentType = await ask("Cual será su metodo de pago?");
clearTerminal();
viewHome();
