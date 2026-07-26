export const ALLERGENS = [
  { id: 'gluten', label: 'Gluten', icon: '🌾', color: '#eab308' },
  { id: 'lactose', label: 'Lácteos', icon: '🥛', color: '#3b82f6' },
  { id: 'nuts', label: 'Frutos Secos', icon: '🥜', color: '#a855f7' },
  { id: 'eggs', label: 'Huevo', icon: '🥚', color: '#f97316' },
  { id: 'fish', label: 'Pescado', icon: '🐟', color: '#06b6d4' },
  { id: 'crustaceans', label: 'Marisco', icon: '🦐', color: '#ef4444' },
  { id: 'vegan', label: 'Vegano', icon: '🌱', color: '#22c55e' },
  { id: 'vegetarian', label: 'Vegetariano', icon: '🥗', color: '#10b981' },
  { id: 'spicy', label: 'Picante', icon: '🌶️', color: '#dc2626' }
];

export const RESTAURANT_ICONS = [
  { id: 'wine', emoji: '🍷', label: 'Mesón / Tradicional' },
  { id: 'steak', emoji: '🥩', label: 'Asador / Carnes' },
  { id: 'pizza', emoji: '🍕', label: 'Pizzería / Trattoria' },
  { id: 'burger', emoji: '🍔', label: 'Hamburguesería' },
  { id: 'coffee', emoji: '☕', label: 'Cafetería / Brunch' },
  { id: 'seafood', emoji: '🦐', label: 'Marisquería' },
  { id: 'tapas', emoji: '🥘', label: 'Bar de Tapas' }
];

export const INITIAL_RESTAURANT = {
  name: "Mesón Paco Mer",
  tagline: "Cocina Tradicional & Menú Diario Casero",
  phone: "+34 912 345 678",
  address: "Calle Mayor 24, Madrid",
  fullPrice: "13.50",
  halfPrice: "9.00",
  currency: "€",
  includesText: "Incluye Pan, 1 Bebida (Vino/Cerveza/Agua) y Postre o Café",
  dateFormatted: new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
  icon: "🍷",
  shift: "Menú del Día (Almuerzo)"
};

export const INITIAL_DISHES = [
  // PRIMEROS
  {
    id: "d1",
    category: "primeros",
    name: "Lentejas Pardinas con Sacristán y Chorizo Casero",
    description: "Guisadas a fuego lento con verduritas de la huerta y sofrito tradicional.",
    supplement: "0.00",
    isChefSpecial: true,
    isAvailable: true,
    allergens: ["gluten"]
  },
  {
    id: "d2",
    category: "primeros",
    name: "Ensalada Templada de Queso de Cabra y Nueces",
    description: "Mezclum de brotes tiernos, vinagreta de miel y frutos secos.",
    supplement: "0.00",
    isChefSpecial: false,
    isAvailable: true,
    allergens: ["lactose", "nuts", "vegetarian"]
  },
  {
    id: "d3",
    category: "primeros",
    name: "Gazpacho Andaluz con Picadillo Tradicional",
    description: "Tomate de la huerta, pimiento, virgen extra y picatostes.",
    supplement: "0.00",
    isChefSpecial: false,
    isAvailable: true,
    allergens: ["vegan", "vegetarian"]
  },

  // SEGUNDOS
  {
    id: "d4",
    category: "segundos",
    name: "Solomillo de Cerdo Ibérico a la Pimienta Verde",
    description: "Acompañado de patatas panaderas doradas al horno.",
    supplement: "0.00",
    isChefSpecial: true,
    isAvailable: true,
    allergens: ["lactose"]
  },
  {
    id: "d5",
    category: "segundos",
    name: "Merluza del Cantábrico a la Vasca con Almejas",
    description: "Lomo de merluza fresca en salsa verde casera con huevo cocido.",
    supplement: "1.50",
    isChefSpecial: false,
    isAvailable: true,
    allergens: ["fish", "crustaceans", "eggs"]
  },
  {
    id: "d6",
    category: "segundos",
    name: "Hamburguesa Vegana de Garbanzos y Espinacas",
    description: "Con queso vegano, tomate de la huerta y boniato frito.",
    supplement: "0.00",
    isChefSpecial: false,
    isAvailable: true,
    allergens: ["vegan", "vegetarian"]
  },

  // POSTRES
  {
    id: "d7",
    category: "postres",
    name: "Tarta de Queso Casera Estilo La Viña",
    description: "Cremosa por dentro, dorada por fuera y servida con coulis de frutos rojos.",
    supplement: "0.00",
    isChefSpecial: true,
    isAvailable: true,
    allergens: ["lactose", "eggs"]
  },
  {
    id: "d8",
    category: "postres",
    name: "Natillas de la Abuela con Galleta María y Canela",
    description: "Receta artesana hecha con leche entera y canela en rama.",
    supplement: "0.00",
    isChefSpecial: false,
    isAvailable: true,
    allergens: ["lactose", "gluten", "eggs"]
  },
  {
    id: "d9",
    category: "postres",
    name: "Fruta Fresca de Temporada (Melón o Sandía)",
    description: "Cortada al momento, muy dulce y refrescante.",
    supplement: "0.00",
    isChefSpecial: false,
    isAvailable: true,
    allergens: ["vegan", "vegetarian"]
  }
];

export const PRESET_MENUS = [
  {
    id: "mar-montana",
    title: "🌊 Menú Mar y Montaña",
    description: "Especialidad en pescados frescos de la ría y carnes asadas.",
    fullPrice: "14.50",
    dishes: [
      { category: "primeros", name: "Paella Mixta Mar y Montaña", description: "Arroz socarrat con marisco y pollo de corral.", supplement: "0.00", isChefSpecial: true, isAvailable: true, allergens: ["crustaceans", "fish"] },
      { category: "primeros", name: "Crema Mariscada con Picatostes", description: "Suave crema de marisco tradicional.", supplement: "0.00", isChefSpecial: false, isAvailable: true, allergens: ["crustaceans", "lactose"] },
      { category: "segundos", name: "Lubina a la Espalda con Ajos Tiernos", description: "Acompañada de verduras salteadas.", supplement: "2.00", isChefSpecial: true, isAvailable: true, allergens: ["fish"] },
      { category: "segundos", name: "Entrecot de Ternera a la Parrilla", description: "Con salsa de cabrales y patatas fritas.", supplement: "0.00", isChefSpecial: false, isAvailable: true, allergens: ["lactose"] },
      { category: "postres", name: "Flan Casero con Nata y Caramelo", description: "Receta artesana de la casa.", supplement: "0.00", isChefSpecial: false, isAvailable: true, allergens: ["lactose", "eggs"] }
    ]
  },
  {
    id: "saludable",
    title: "🥗 Menú Ejecutivo & Saludable",
    description: "Opciones ligeras, equilibradas y nutritivas para el día a día.",
    fullPrice: "12.90",
    dishes: [
      { category: "primeros", name: "Bowl de Quinoa con Aguacate y Edamame", description: "Aliñado con vinagreta de sésamo y lima.", supplement: "0.00", isChefSpecial: true, isAvailable: true, allergens: ["vegan", "vegetarian"] },
      { category: "primeros", name: "Crema de Calabaza y Jengibre con Pipas", description: "Textura sedosa con toque especiado.", supplement: "0.00", isChefSpecial: false, isAvailable: true, allergens: ["vegan", "vegetarian"] },
      { category: "segundos", name: "Salmón a la Plancha sobre Cama de Espárragos", description: "Con eneldo fresco y limón salteado.", supplement: "1.00", isChefSpecial: true, isAvailable: true, allergens: ["fish"] },
      { category: "segundos", name: "Pechuga de Pavo Marinada a las Hierbas", description: "Servida con arroz salvaje al vapor.", supplement: "0.00", isChefSpecial: false, isAvailable: true, allergens: [] },
      { category: "postres", name: "Yogur Griego con Miel y Frutos Secos", description: "Rico en proteínas y muy cremoso.", supplement: "0.00", isChefSpecial: false, isAvailable: true, allergens: ["lactose", "nuts", "vegetarian"] }
    ]
  },
  {
    id: "tapas",
    title: "🍷 Menú de Tapas y Raciones",
    description: "Variado y perfecto para compartir o cenar.",
    fullPrice: "11.50",
    dishes: [
      { category: "primeros", name: "Croquetas Caseras de Jamón Ibérico (4 uds)", description: "Bechamel cremosa empanada al punto.", supplement: "0.00", isChefSpecial: true, isAvailable: true, allergens: ["gluten", "lactose", "eggs"] },
      { category: "primeros", name: "Patatas Bravas con Salsa Mixta y Alioli", description: "Crujientes por fuera y tiernas por dentro.", supplement: "0.00", isChefSpecial: false, isAvailable: true, allergens: ["eggs", "spicy"] },
      { category: "segundos", name: "Carrilleras de Cerdo al Vino Tinto", description: "Guisadas 6 horas con puré de patata casero.", supplement: "0.00", isChefSpecial: true, isAvailable: true, allergens: ["lactose"] },
      { category: "segundos", name: "Calamares a la Romana con Limón", description: "Anillas de calamar fresco en tempura.", supplement: "0.00", isChefSpecial: false, isAvailable: true, allergens: ["gluten", "fish"] },
      { category: "postres", name: "Tarta de la Abuela (Chocolate y Crema)", description: "El clásico postre familiar de siempre.", supplement: "0.00", isChefSpecial: true, isAvailable: true, allergens: ["gluten", "lactose"] }
    ]
  }
];
