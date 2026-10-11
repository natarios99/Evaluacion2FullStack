const STORAGE_KEY_PRODUCTS = 'tienda_productos';
const STORAGE_KEY_CART = 'tienda_carrito';

const initialProducts = [
  { id: 1, nombre: 'The Legend of Zelda', precio: 59990, categoria: 'Juegos', oferta: true, stock: 15, img: 'https://via.placeholder.com/400x200' },
  { id: 2, nombre: 'Super Mario Odyssey', precio: 49990, categoria: 'Juegos', oferta: false, stock: 3, img: 'https://via.placeholder.com/400x200' },
  { id: 3, nombre: 'Minecraft', precio: 24990, categoria: 'Juegos', oferta: true, stock: 20, img: 'https://via.placeholder.com/400x200' }
];

export const dataRepository = {
  // READ
  getProducts: () => {
    const data = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(initialProducts));
      return initialProducts;
    }
    return JSON.parse(data);
  },

  // CREATE
  addProduct: (product) => {
    const products = dataRepository.getProducts();
    const newProduct = { ...product, id: Date.now() };
    products.push(newProduct);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    return newProduct;
  },

  // UPDATE
  updateProduct: (id, updatedFields) => {
    let products = dataRepository.getProducts();
    products = products.map(p => p.id === id ? { ...p, ...updatedFields } : p);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  },

  // DELETE
  deleteProduct: (id) => {
    const products = dataRepository.getProducts().filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  },

  // Carrito de Compras
  getCart: () => JSON.parse(localStorage.getItem(STORAGE_KEY_CART)) || [],
  saveCart: (cart) => localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(cart)),
  clearCart: () => localStorage.removeItem(STORAGE_KEY_CART)
};  