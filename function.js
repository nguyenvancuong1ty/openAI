import OpenAI from "openai";
import "dotenv/config";
import { mockProductsDB } from "./product.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Giả lập database sản phẩm

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
