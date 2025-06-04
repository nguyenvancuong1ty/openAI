import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

// Giả lập database sản phẩm
const mockProductsDB = [
  { id: 1, name: "iPhone 14", category: "điện thoại", price: 25000000 },
  { id: 2, name: "Samsung S23", category: "điện thoại", price: 22000000 },
  { id: 3, name: "Oppo A95", category: "điện thoại", price: 6000000 },
  { id: 4, name: "MacBook Air", category: "laptop", price: 32000000 },
  { id: 5, name: "Dell XPS", category: "laptop", price: 35000000 },
  { id: 6, name: "iPad Pro", category: "máy tính bảng", price: 27000000 },
  { id: 7, name: "iPad Mini", category: "máy tính bảng", price: 15000000 },
  { id: 8, name: "Lenovo ThinkPad", category: "laptop", price: 28000000 },
  { id: 9, name: "Asus ROG", category: "laptop", price: 40000000 },
  { id: 10, name: "HP Spectre", category: "laptop", price: 30000000 },
  { id: 11, name: "Xiaomi 13", category: "điện thoại", price: 18000000 },
  { id: 12, name: "Realme 11 Pro", category: "điện thoại", price: 7000000 },
  { id: 13, name: "Nokia X30", category: "điện thoại", price: 6500000 },
  { id: 14, name: "MacBook Pro", category: "laptop", price: 45000000 },
  {
    id: 15,
    name: "Apple Watch Series 9",
    category: "đồng hồ",
    price: 12000000,
  },
  {
    id: 16,
    name: "Samsung Galaxy Watch 6",
    category: "đồng hồ",
    price: 10000000,
  },
  { id: 17, name: "Sony WH-1000XM5", category: "tai nghe", price: 8000000 },
  { id: 18, name: "AirPods Pro 2", category: "tai nghe", price: 6000000 },
  { id: 19, name: "JBL Tune 760NC", category: "tai nghe", price: 2000000 },
  { id: 20, name: "Canon EOS M50", category: "máy ảnh", price: 15000000 },
  { id: 21, name: "Sony Alpha A6400", category: "máy ảnh", price: 18000000 },
  { id: 22, name: "GoPro Hero 11", category: "máy quay", price: 14000000 },
  { id: 23, name: "DJI Osmo Pocket 3", category: "máy quay", price: 12000000 },
  { id: 24, name: "DJI Mini 4 Pro", category: "drone", price: 20000000 },
  { id: 25, name: "DJI Mavic 3", category: "drone", price: 35000000 },
  { id: 26, name: "Surface Pro 9", category: "máy tính bảng", price: 28000000 },
  {
    id: 27,
    name: "Huawei MatePad",
    category: "máy tính bảng",
    price: 13000000,
  },
  {
    id: 28,
    name: "Kindle Paperwhite",
    category: "máy đọc sách",
    price: 4000000,
  },
  {
    id: 29,
    name: "Amazon Echo Dot",
    category: "thiết bị thông minh",
    price: 1500000,
  },
  {
    id: 30,
    name: "Google Nest Hub",
    category: "thiết bị thông minh",
    price: 3000000,
  },
  { id: 31, name: "LG OLED C2", category: "tivi", price: 40000000 },
  { id: 32, name: "Samsung Neo QLED", category: "tivi", price: 45000000 },
  { id: 33, name: "TCL 4K TV", category: "tivi", price: 15000000 },
  {
    id: 34,
    name: "Logitech MX Master 3",
    category: "phụ kiện",
    price: 2500000,
  },
  { id: 35, name: "Razer DeathAdder", category: "phụ kiện", price: 1200000 },
  { id: 36, name: "Corsair K95", category: "phụ kiện", price: 3500000 },
  { id: 37, name: "Anker PowerCore 20K", category: "phụ kiện", price: 800000 },
  { id: 38, name: "Baseus GaN Charger", category: "phụ kiện", price: 600000 },
  { id: 39, name: "Xiaomi Mi Band 8", category: "đồng hồ", price: 1200000 },
  {
    id: 40,
    name: "Garmin Forerunner 255",
    category: "đồng hồ",
    price: 8000000,
  },
  { id: 41, name: "iMac M3", category: "máy tính để bàn", price: 45000000 },
  { id: 42, name: "HP Pavilion", category: "máy tính để bàn", price: 20000000 },
  { id: 43, name: "Asus VivoBook", category: "laptop", price: 18000000 },
  { id: 44, name: "MSI Stealth 15", category: "laptop", price: 32000000 },
  { id: 45, name: "Acer Swift 5", category: "laptop", price: 15000000 },
  { id: 46, name: "iPhone 13", category: "điện thoại", price: 20000000 },
  { id: 47, name: "Samsung Z Flip 5", category: "điện thoại", price: 25000000 },
  { id: 48, name: "Realme C55", category: "điện thoại", price: 5000000 },
  { id: 49, name: "OnePlus 11", category: "điện thoại", price: 18000000 },
  { id: 50, name: "Vivo V29", category: "điện thoại", price: 14000000 },
  { id: 51, name: "Asus Zenfone 10", category: "điện thoại", price: 17000000 },
  { id: 52, name: "Sony Xperia 1 V", category: "điện thoại", price: 23000000 },
  { id: 53, name: "Lenovo Legion 5", category: "laptop", price: 28000000 },
  {
    id: 54,
    name: "Mac Studio M2",
    category: "máy tính để bàn",
    price: 60000000,
  },
  { id: 55, name: "AirPods 3", category: "tai nghe", price: 4000000 },
];

function getProductListFromDB({ name = "", limit = 10, offset = 0 }) {
  const keyword = name.toLowerCase();

  const filtered = mockProductsDB.filter(
    (p) =>
      p.name.toLowerCase().includes(keyword) ||
      p.category.toLowerCase().includes(keyword)
  );

  return filtered.slice(offset, offset + limit);
}

async function callGetProductList(question) {
  // Gửi message và yêu cầu gọi function
  const response = await client.chat.completions.create({
    model: "gpt-4-0613",
    messages: [
      {
        role: "user",
        content: question,
      },
    ],
    functions: [
      {
        name: "get_product_list",
        description: "Retrieves a list of products from the database",
        parameters: {
          type: "object",
          required: ["category", "limit", "offset", "name"],
          properties: {
            limit: {
              type: "number",
              description: "Max number of products",
            },
            offset: {
              type: "number",
              description: "How many to skip",
            },
            name: {
              type: "string",
              description: "Name of product",
            },
            category: {
              type: "string",
              description: "Product category",
            },
          },
        },
      },
    ],
    function_call: { name: "get_product_list" },
  });

  // Lấy argument function call
  const functionArgs = JSON.parse(
    response.choices[0].message.function_call.arguments
  );

  // Lấy dữ liệu từ "db"
  const products = getProductListFromDB(functionArgs);

  console.log("✅ Danh sách sản phẩm:", products);

  // Sau khi có kết quả, gửi lại cho ChatGPT để lấy câu trả lời hoàn chỉnh
  const followUpResponse = await client.chat.completions.create({
    model: "gpt-4-0613",
    messages: [
      {
        role: "user",
        content: question,
      },
      {
        role: "assistant",
        content: null,
        function_call: {
          name: "get_product_list",
          arguments: JSON.stringify(functionArgs),
        },
      },
      {
        role: "function",
        name: "get_product_list",
        content: JSON.stringify(products),
      },
    ],
  });

  // In câu trả lời của bot sau khi đã có dữ liệu từ function
  console.log("💬 Bot trả lời:", followUpResponse.choices[0].message.content);
}

// Lấy question từ tham số dòng lệnh
const question = process.argv[2] || "Có iPhone nào"; // Nếu không truyền sẽ mặc định câu hỏi này

callGetProductList(question);
