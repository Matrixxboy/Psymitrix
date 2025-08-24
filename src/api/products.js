// Mock products API
export const getProducts = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    success: true,
    data: [
      { id: 1, name: 'Product 1', price: 99.99 },
      { id: 2, name: 'Product 2', price: 149.99 },
      { id: 3, name: 'Product 3', price: 199.99 }
    ]
  };
};
