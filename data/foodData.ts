import { FoodItem } from '@/types';

export const categories = [
  'All',
  'Burgers',
  'Mains',
  'Starters',
  'Desserts',
  'Beverages',
  'Alcohols',
];

export const foodItems: FoodItem[] = [
  {
    id: '1',
    name: 'Classic Cheeseburger',
    description:
      'Juicy beef patty with melted cheddar cheese, fresh lettuce, tomatoes, onions, pickles, and our special sauce on a toasted sesame bun',
    price: 12.99,
    image: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg',
    category: 'Burgers',
    rating: 4.8,
    prepTime: '15-20 mins',
    sides: ['Fries', 'Onion Rings', 'Salad', 'Coleslaw'],
    drinks: [
      { id: 'd1', name: 'Coke', price: 0 },
      { id: 'd2', name: 'Sprite', price: 0 },
      { id: 'd3', name: 'Fanta', price: 0 },
      { id: 'd4', name: 'Water', price: 0 },
    ],
    extras: [
      { id: 'e1', name: 'Extra Cheese', price: 1.5 },
      { id: 'e2', name: 'Bacon', price: 2.5 },
      { id: 'e3', name: 'Avocado', price: 2.0 },
      { id: 'e4', name: 'Extra Patty', price: 4.0 },
    ],
    removableIngredients: ['Lettuce', 'Tomatoes', 'Onions', 'Pickles'],
  },
  {
    id: '2',
    name: 'Veggie Burger',
    description:
      'Delicious plant-based patty with fresh vegetables, lettuce, tomatoes, and our signature vegan mayo on a whole wheat bun',
    price: 11.99,
    image: 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg',
    category: 'Burgers',
    rating: 4.6,
    prepTime: '12-15 mins',
    sides: ['Sweet Potato Fries', 'Garden Salad', 'Grilled Vegetables'],
    drinks: [
      { id: 'd1', name: 'Coke', price: 0 },
      { id: 'd2', name: 'Sprite', price: 0 },
      { id: 'd5', name: 'Iced Tea', price: 0 },
    ],
    extras: [
      { id: 'e5', name: 'Grilled Mushrooms', price: 2.0 },
      { id: 'e3', name: 'Avocado', price: 2.0 },
      { id: 'e6', name: 'Vegan Cheese', price: 1.5 },
    ],
    removableIngredients: ['Lettuce', 'Tomatoes', 'Onions'],
  },
  {
    id: '3',
    name: 'Spicy Chicken Burger',
    description:
      'Crispy fried chicken breast with spicy mayo, jalapeños, lettuce, and tomatoes on a brioche bun',
    price: 13.99,
    image:
      'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg',
    category: 'Burgers',
    rating: 4.9,
    prepTime: '18-22 mins',
    sides: ['Fries', 'Onion Rings', 'Mac & Cheese', 'Coleslaw'],
    drinks: [
      { id: 'd1', name: 'Coke', price: 0 },
      { id: 'd6', name: 'Lemonade', price: 0 },
      { id: 'd4', name: 'Water', price: 0 },
    ],
    extras: [
      { id: 'e1', name: 'Extra Cheese', price: 1.5 },
      { id: 'e7', name: 'Extra Jalapeños', price: 1.0 },
      { id: 'e8', name: 'Buffalo Sauce', price: 0.5 },
    ],
    removableIngredients: ['Lettuce', 'Tomatoes', 'Jalapeños'],
  },
  {
    id: '4',
    name: 'Grilled Salmon',
    description:
      'Fresh Atlantic salmon grilled to perfection, served with roasted vegetables and lemon butter sauce',
    price: 22.99,
    image: 'https://images.pexels.com/photos/1859227/pexels-photo-1859227.jpeg',
    category: 'Mains',
    rating: 4.7,
    prepTime: '25-30 mins',
    sides: ['Mashed Potatoes', 'Rice', 'Grilled Vegetables', 'Garden Salad'],
    extras: [
      { id: 'e9', name: 'Extra Lemon Butter Sauce', price: 2.0 },
      { id: 'e10', name: 'Garlic Bread', price: 3.0 },
    ],
  },
  {
    id: '5',
    name: 'Ribeye Steak',
    description:
      'Premium 12oz ribeye steak cooked to your preference, served with seasonal vegetables',
    price: 28.99,
    image: 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg',
    category: 'Mains',
    rating: 4.9,
    prepTime: '30-35 mins',
    sides: ['Mashed Potatoes', 'Fries', 'Baked Potato', 'Grilled Vegetables'],
    extras: [
      { id: 'e11', name: 'Peppercorn Sauce', price: 2.5 },
      { id: 'e12', name: 'Garlic Butter', price: 2.0 },
      { id: 'e13', name: 'Side Salad', price: 3.5 },
    ],
  },
  {
    id: '6',
    name: 'Chicken Alfredo Pasta',
    description:
      'Creamy fettuccine alfredo with grilled chicken breast and parmesan cheese',
    price: 16.99,
    image:
      'https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg',
    category: 'Mains',
    rating: 4.6,
    prepTime: '20-25 mins',
    sides: ['Garlic Bread', 'Caesar Salad', 'Soup'],
    extras: [
      { id: 'e14', name: 'Extra Chicken', price: 4.0 },
      { id: 'e15', name: 'Mushrooms', price: 2.0 },
      { id: 'e16', name: 'Extra Parmesan', price: 1.5 },
    ],
  },
  {
    id: '7',
    name: 'Buffalo Wings',
    description:
      'Crispy chicken wings tossed in buffalo sauce, served with celery sticks and blue cheese dip',
    price: 10.99,
    image:
      'https://images.pexels.com/photos/2619970/pexels-photo-2619970.jpeg',
    category: 'Starters',
    rating: 4.7,
    prepTime: '15-18 mins',
    extras: [
      { id: 'e17', name: 'Extra Wings (6pc)', price: 5.0 },
      { id: 'e18', name: 'Ranch Dip', price: 1.0 },
      { id: 'e19', name: 'Extra Blue Cheese', price: 1.5 },
    ],
  },
  {
    id: '8',
    name: 'Mozzarella Sticks',
    description:
      'Golden fried mozzarella cheese sticks served with marinara sauce',
    price: 8.99,
    image: 'https://images.pexels.com/photos/4109998/pexels-photo-4109998.jpeg',
    category: 'Starters',
    rating: 4.5,
    prepTime: '10-12 mins',
    extras: [
      { id: 'e20', name: 'Extra Marinara Sauce', price: 1.0 },
      { id: 'e21', name: 'Ranch Dip', price: 1.0 },
    ],
  },
  {
    id: '9',
    name: 'Loaded Nachos',
    description:
      'Crispy tortilla chips topped with melted cheese, jalapeños, sour cream, guacamole, and salsa',
    price: 11.99,
    image:
      'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg',
    category: 'Starters',
    rating: 4.8,
    prepTime: '12-15 mins',
    extras: [
      { id: 'e22', name: 'Extra Guacamole', price: 2.0 },
      { id: 'e23', name: 'Extra Sour Cream', price: 1.5 },
      { id: 'e24', name: 'Pulled Pork', price: 4.0 },
    ],
  },
  {
    id: '10',
    name: 'Chocolate Lava Cake',
    description:
      'Warm chocolate cake with a molten chocolate center, served with vanilla ice cream',
    price: 7.99,
    image:
      'https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg',
    category: 'Desserts',
    rating: 4.9,
    prepTime: '10-12 mins',
    extras: [
      { id: 'e25', name: 'Extra Ice Cream Scoop', price: 2.0 },
      { id: 'e26', name: 'Whipped Cream', price: 1.0 },
    ],
  },
  {
    id: '11',
    name: 'Cheesecake',
    description:
      'Classic New York style cheesecake with berry compote',
    price: 6.99,
    image:
      'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg',
    category: 'Desserts',
    rating: 4.7,
    prepTime: '5-8 mins',
    extras: [
      { id: 'e27', name: 'Extra Berry Compote', price: 1.5 },
      { id: 'e28', name: 'Chocolate Drizzle', price: 1.0 },
    ],
  },
  {
    id: '12',
    name: 'Fresh Orange Juice',
    description: 'Freshly squeezed orange juice',
    price: 4.99,
    image:
      'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg',
    category: 'Beverages',
    rating: 4.8,
    prepTime: '3-5 mins',
  },
  {
    id: '13',
    name: 'Iced Coffee',
    description: 'Cold brew coffee served over ice with milk',
    price: 5.49,
    image:
      'https://images.pexels.com/photos/2307221/pexels-photo-2307221.jpeg',
    category: 'Beverages',
    rating: 4.6,
    prepTime: '3-5 mins',
    extras: [
      { id: 'e29', name: 'Extra Shot', price: 1.5 },
      { id: 'e30', name: 'Vanilla Syrup', price: 0.5 },
      { id: 'e31', name: 'Caramel Syrup', price: 0.5 },
    ],
  },
  {
    id: '14',
    name: 'Craft Beer',
    description: 'Selection of local craft beers',
    price: 6.99,
    image: 'https://images.pexels.com/photos/1552630/pexels-photo-1552630.jpeg',
    category: 'Alcohols',
    rating: 4.5,
    prepTime: '2-3 mins',
  },
  {
    id: '15',
    name: 'House Wine',
    description: 'Red or white wine by the glass',
    price: 8.99,
    image:
      'https://images.pexels.com/photos/1407846/pexels-photo-1407846.jpeg',
    category: 'Alcohols',
    rating: 4.4,
    prepTime: '2-3 mins',
  },
];
