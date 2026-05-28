const fs = require('fs');
const path = require('path');

const products = [
  { name: "Wireless Headphones", query: "wireless headphones", filename: "wireless_headphones.jpg" },
  { name: "Running Shoes", query: "running shoes", filename: "running_shoes.jpg" },
  { name: "Leather Wallet", query: "leather wallet", filename: "leather_wallet.jpg" },
  { name: "Smart Watch", query: "smart watch", filename: "smart_watch.jpg" },
  { name: "Backpack", query: "backpack", filename: "backpack.jpg" },
  { name: "Sunglasses", query: "sunglasses", filename: "sunglasses.jpg" },
  { name: "Bluetooth Speaker", query: "bluetooth speaker", filename: "bluetooth_speaker.jpg" },
  { name: "Trail Hiking Boots", query: "hiking boots", filename: "trail_hiking_boots.jpg" },
  { name: "Aviator Sunglasses", query: "aviator sunglasses", filename: "aviator_sunglasses.jpg" },
  { name: "Laptop Messenger Bag", query: "messenger bag", filename: "laptop_messenger_bag.jpg" },
  { name: "Fitness Tracker Band", query: "fitness tracker", filename: "fitness_tracker_band.jpg" },
  { name: "Canvas Sneakers", query: "canvas sneakers", filename: "canvas_sneakers.jpg" },
  { name: "Travel Duffel Bag", query: "duffel bag", filename: "travel_duffel_bag.jpg" },
  { name: "Card Holder", query: "card holder wallet", filename: "card_holder.jpg" },
  { name: "Noise Cancelling Earbuds", query: "earbuds", filename: "noise_cancelling_earbuds.jpg" },
  { name: "Formal Oxford Shoes", query: "oxford shoes", filename: "formal_oxford_shoes.jpg" },
  { name: "Crossbody Sling Bag", query: "sling bag", filename: "crossbody_sling_bag.jpg" },
  { name: "Mechanical Keyboard", query: "mechanical keyboard", filename: "mechanical_keyboard.jpg" },
  { name: "Polarized Sport Glasses", query: "sport sunglasses", filename: "polarized_sport_glasses.jpg" },
  { name: "Gym Training Shoes", query: "gym shoes", filename: "gym_training_shoes.jpg" },
  { name: "Ergonomic Gaming Mouse", query: "gaming mouse", filename: "ergonomic_gaming_mouse.jpg" },
  { name: "27-inch 4K Monitor", query: "computer monitor", filename: "27_inch_4k_monitor.jpg" },
  { name: "Classic Leather Belt", query: "leather belt", filename: "classic_leather_belt.jpg" },
  { name: "Vintage Camera Backpack", query: "camera backpack", filename: "vintage_camera_backpack.jpg" },
  { name: "Minimalist Silver Ring", query: "silver ring", filename: "minimalist_silver_ring.jpg" }
];

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
  for (const p of products) {
    try {
      const apiUrl = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(p.query)}&per_page=1`;
      const res = await fetch(apiUrl);
      if (!res.ok) {
        console.error(`Failed to search for ${p.query}`);
        continue;
      }
      const data = await res.json();
      if (!data.results || data.results.length === 0) {
        console.error(`No results for ${p.query}`);
        continue;
      }
      
      const imgUrl = data.results[0].urls.regular;
      const imgRes = await fetch(imgUrl);
      if (!imgRes.ok) {
        console.error(`Failed to download image for ${p.query}`);
        continue;
      }
      
      const buffer = Buffer.from(await imgRes.arrayBuffer());
      const dest = path.join(__dirname, 'public', 'images', p.filename);
      fs.writeFileSync(dest, buffer);
      console.log(`Downloaded ${p.filename}`);
      
      await delay(500); // polite delay
    } catch (err) {
      console.error(`Error on ${p.name}:`, err.message);
    }
  }
}

run().catch(console.error);
