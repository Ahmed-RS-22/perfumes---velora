# 💎 Velora Perfume App

**A modern e-commerce platform built with React and Supabase**

Velora Perfume App is a sleek, responsive perfume e-commerce web application that allows users to browse, shop, and manage their favourite products. The platform includes a powerful admin dashboard, user profiles, order management, and full Supabase backend integration for real-time functionality.

---

## 🚀 Features

### 🛍 User Features

* **User Authentication** (Supabase Auth)
* **Product Browsing** — modern product cards with stock, pricing, and category display
* **Product Management** — add, update, delete products with image uploads
* **Cart System** — add/remove products, update quantity, real-time UI updates
* **Favourites System** — add/remove items to favourites with instant UI feedback
* **Orders System** — place orders through a clean modal interface
* **Profile Management** — update personal info and preferences
* **Responsive Design** — fully optimized for mobile, tablet, and desktop

### 🧑‍💼 Admin Features

* **Dashboard Overview**
* **Manage Products** (CRUD operations)
* **Manage Users** (profiles, roles, and info)
* **Manage Orders** (update order status)
* **App Settings** — configurable from dashboard

### 🗄 Backend (Supabase)

* Supabase provides database, storage, and authentication.
* **Tables:** `profiles`, `products`, `cart_items`, `orders`, `order_items`, `favourites`
* Image handling powered by **Supabase Storage**.

---

## 🧰 Tech Stack

**Frontend**

* ⚛️ React 19
* 🧭 React Router DOM 7
* 🎨 Tailwind CSS + MUI
* 🧩 Lucide Icons + React Icons
* ⚡ Vite (for blazing-fast builds)
* 🔥 React Hot Toast (notifications)
* ✅ React Hook Form + Zod (validation)

**State Management**

* 🪣 Redux Toolkit + React Redux

**Backend**

* 🧱 Supabase (Database, Auth, Storage, API)

**Deployment**

* ▲ Deployed on **Vercel**

---

## 📁 Folder Structure

```
velora-perfume-app/
│
├── src/
│   ├── app/                 # Page-level components
│   ├── components/          # Reusable UI components
│   ├── redux/
│   │   ├── slices/          # Redux slices (cart, favourites, orders, etc.)
│   │   └── store.js
│   ├── lib/                 # Supabase client & API helpers
│   ├── utils/               # Utilities (notify, cn helper, etc.)
│   ├── assets/              # Static images and icons
│   └── main.jsx             # App entry point
│
├── public/
│   └── favicon.ico
│
├── .env                     # Supabase credentials
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/velora-perfume-app.git
cd velora-perfume-app
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Set up environment variables

Create a `.env` file in the project root and add:

```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4️⃣ Run the app

```bash
npm run dev
```

App will run at **[http://localhost:5173](http://localhost:5173)**

---

## 📦 Available Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start development server             |
| `npm run build`   | Build the app for production         |
| `npm run preview` | Preview the production build locally |
| `npm run lint`    | Run ESLint checks                    |

---

## 🌐 Deployment

The app is deployed on **Vercel**.
Simply push your changes to GitHub, and Vercel automatically handles:

* Build process using `vite build`
* Environment variables
* Continuous deployment

---

## 📸 Screenshots (optional)

> *(Add screenshots of your home page, product details, cart, and admin dashboard here)*
> Example:
>
> ```markdown
> ![Home Page](./screenshots/home.png)
> ![Cart Page](./screenshots/cart.png)
> ```

---

## 🙌 Acknowledgements

* [Supabase](https://supabase.com/)
* [React](https://react.dev/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Redux Toolkit](https://redux-toolkit.js.org/)
* [Vercel](https://vercel.com/)

---

### 💎 Author

**Velora Perfume App** — Designed and developed by *Ahmed Reda Salam*
