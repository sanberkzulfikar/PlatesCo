class Basket {
    constructor(products, deliveryRules, offers) {
      this.products = products;
      this.deliveryRules = deliveryRules;
      this.offers = offers;
      this.basket = [];
    }
  
    add(productCode) {
      if (this.products[productCode]) {
        this.basket.push(this.products[productCode]);
        this.updateBasketUI();
      }
    }
  
    remove(index) {
      if (index > -1) {
        this.basket.splice(index, 1);
        this.updateBasketUI();
      }
    }
  
    clear() {
      this.basket = [];
      this.updateBasketUI();
    }
  
    updateBasketUI() {
      const basketItems = document.getElementById('basket-items');
      basketItems.innerHTML = '';
      this.basket.forEach((item, index) => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.textContent = `${item.name} - $${item.price.toFixed(2)}`;
  
        const deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger btn-sm';
        deleteButton.textContent = 'Remove';
        deleteButton.addEventListener('click', () => {
          this.remove(index);
        });
  
        listItem.appendChild(deleteButton);
        basketItems.appendChild(listItem);
      });
      document.getElementById('basket-total').textContent = this.total();
    }
  
    total() {
      let totalCost = this.basket.reduce((sum, item) => sum + item.price, 0);
  
      // Apply special offers
      if (this.offers['R01']) {
        let redPlates = this.basket.filter(item => item.code === 'R01');
        let numRedPlates = redPlates.length;
        if (numRedPlates > 1) {
          let discount = Math.floor(numRedPlates / 2) * (redPlates[0].price / 2);
          totalCost -= discount;
        }
      }
  
      // Apply delivery charges
      if (totalCost < 50 && totalCost > 0) {
        totalCost += this.deliveryRules['under50'];
      } else if (totalCost < 90 && totalCost > 0) {
        totalCost += this.deliveryRules['under90'];
      }
  
      return totalCost.toFixed(2);
    }
  }
  
  // Product catalog
  const products = {
    'R01': { code: 'R01', name: 'Red Plate', price: 32.95 },
    'G01': { code: 'G01', name: 'Green Plate', price: 24.95 },
    'B01': { code: 'B01', name: 'Blue Plate', price: 7.95 },
  };
  
  // Delivery charge rules
  const deliveryRules = {
    under50: 4.95,
    under90: 2.95,
  };
  
  // Offers
  const offers = {
    'R01': 'buy one red plate, get the second half price',
  };
  
  const basket = new Basket(products, deliveryRules, offers);
  
  document.querySelectorAll('.add-to-basket').forEach(button => {
    button.addEventListener('click', (event) => {
      const productCode = event.target.getAttribute('data-code');
      basket.add(productCode);
    });
  });
  
  document.getElementById('clear-basket').addEventListener('click', () => {
    basket.clear();
  });