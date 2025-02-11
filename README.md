# Kerjain

This app uses the T3 Stack. Usage guideline:

## 📥 Clone the Repository

```sh
git clone https://github.com/ahsanzizan/kerjain.git
cd kerjain
```

## 📦 Install Dependencies

Ensure you have **Node.js (18+)** and **pnpm/npm/yarn** installed. Then, run:

```sh
pnpm install  # or npm install or yarn install
```

## 🔑 Set Up Environment Variables

Create a `.env` file in the root directory and configure the following variables:

```env
DATABASE_URL="mysql://user:password@localhost:3306/dbname"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

Modify the values based on your database and authentication setup.

## 🗄️ Set Up the Database (Prisma)

Run the following commands to migrate the database:

```sh
pnpm prisma db push  # Sync schema with the database
pnpm prisma generate  # Generate Prisma client
```

## 🏃‍♂️ Run the Development Server

Start the Next.js app:

```sh
pnpm dev  # or npm run dev or yarn dev
```

The app will be available at **http://localhost:3000**.

## ✅ Production Build

To create a production build:

```sh
pnpm build
pnpm start
```

## 🛠️ Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Prisma** (ORM)
- **NextAuth.js** (Authentication)
- **Tailwind CSS** (Styling)
- **tRPC (Optional)**

## 🔗 Useful Commands

- `pnpm prisma studio` → Open Prisma Studio (UI for DB management)
- `pnpm lint` → Run linting
- `pnpm test` → Run tests

---

(AI Generated, I'm too lazy to write all of this🤏.)
